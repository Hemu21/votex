pragma circom 2.0.0;

include "./poseidon.circom";

template switchPosition() {
    signal input in[2];
    signal input s;
    signal output out[2];

    // Boolean constraint for s
    s * (1 - s) === 0;

    // Use s to select between the two input values.
    out[0] <== (in[1] - in[0]) * s + in[0];
    out[1] <== (in[0] - in[1]) * s + in[1];
}

template privateKeyHasher() {
    signal input privateKey;
    signal output publicKey;
    component poseidonComponent = Poseidon(1);
    poseidonComponent.inputs[0] <== privateKey;
    publicKey <== poseidonComponent.out;
}

template nullifierHasher() {
    signal input root;
    signal input privateKey;
    signal input proposalId;
    signal output nullifier;
    component poseidonComponent = Poseidon(3);
    poseidonComponent.inputs[0] <== root;
    poseidonComponent.inputs[1] <== privateKey;
    poseidonComponent.inputs[2] <== proposalId;
    nullifier <== poseidonComponent.out;
}

template proveVote(levels) {
    // Private inputs
    signal input privateKey;
    // Public inputs
    signal input root;
    signal input proposalId;
    signal input vote;
    // New public input for the computed nullifier
    signal input nullifierPub;
    // Inputs for Merkle proof (the sibling nodes and path indices)
    signal input pathElements[levels];
    signal input pathIndices[levels];

    // Compute the leaf from the voter's private key.
    signal leaf;
    component hasherComponent = privateKeyHasher();
    hasherComponent.privateKey <== privateKey;
    leaf <== hasherComponent.publicKey;

    // Compute the Merkle root from the provided path.
    component selectors[levels];
    component hashers[levels];
    signal computedPath[levels];

    for (var i = 0; i < levels; i++) {
        selectors[i] = switchPosition();
        // For the first layer, use the computed leaf; for subsequent layers, use the previous hash.
        selectors[i].in[0] <== i == 0 ? leaf : computedPath[i - 1];
        selectors[i].in[1] <== pathElements[i];
        selectors[i].s <== pathIndices[i];

        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== selectors[i].out[0];
        hashers[i].inputs[1] <== selectors[i].out[1];
        computedPath[i] <== hashers[i].out;
    }
    // Impose the constraint that the computed root equals the provided root.
    root === computedPath[levels - 1];

    // Compute the nullifier based on the root, the private key, and the proposalId.
    signal computedNullifier;
    component nullifierComponent = nullifierHasher();
    nullifierComponent.root <== root;
    nullifierComponent.privateKey <== privateKey;
    nullifierComponent.proposalId <== proposalId;
    computedNullifier <== nullifierComponent.nullifier;

    // Force the computed nullifier to equal the public input.
    computedNullifier === nullifierPub;
}

// Update the main component to expose all four public signals in the expected order:
// [nullifierPub, root, proposalId, vote]
component main {public [nullifierPub, root, proposalId, vote]} = proveVote(2);
