import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";
import { IoWalletOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { EthContext } from "../context";

export default function ConnectedUserButton() {
  const navigate = useNavigate();
  const { connectWallet, connectButtonText, account, disconnectWallet } =
    useContext(EthContext);

  return (
    <div className="relative w-full bg-transparent">
      {!account ? (
        <button
          onClick={() =>
            window.ethereum
              ? connectWallet()
              : window.open("https://metamask.io/download.html", "_blank")
          }
          className="bg-blue-500 hover:bg-blue-700 text-white text-bold text-lg py-2 px-6 rounded-2xl"
        >
          {connectButtonText}
        </button>
      ) : (
        <Menu as="div" className="relative w-full bg-transparent">
          <MenuButton className="border-white h-[45px] px-[28px] border-[2px] outline-none rounded-2xl flex items-center gap-3">
            <IoWalletOutline size={20} className="" />
            <span className="text-white text-lg ">{connectButtonText}</span>
            <FaChevronDown className=" text-[15px]" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-[170px] flex flex-col gap-4 py-4 px-2 items-center bg-white rounded-[10px] shadow-lg z-20">
            <MenuItem>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full text-center py-2 text-black hover:text-gray-500"
              >
                Dashboard
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => disconnectWallet() && navigate("/")}
                className=" text-center  text-red-500 hover:text-red-700 flex items-center gap-2"
              >
                <LuLogOut /> Logout
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      )}
    </div>
  );
}
