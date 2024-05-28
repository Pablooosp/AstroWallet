import React, {useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import astroLogo from "../assets/icon.svg";
import {
  User,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const handleSetActive = (path) => {
    setActive(path);
  };

  return (
    <header className="w-full h-[10%] flex items-center justify-between">
      <div className="flex items-center w-[20%] justify-center">
        <img src={astroLogo} alt="" className="w-12" />
        <h2 className="logoText font-bold text-4xl text-[#ffea00] select-none">
          AstroWallet
        </h2>
      </div>
      <nav className="flex justify-around items-center h-full">
        <Link
          to="/dashboard"
          className={`text-white text-2xl font-bold p-2 flex items-center h-full ${active === '/dashboard' ? 'border-b-2 border-white rounded-sm' : ''}`}
          onClick={() => handleSetActive('/dashboard')}
        >
          Dashboard
        </Link>
        <Link
          to="/transacciones"
          className={`text-white text-2xl font-bold p-2 flex items-center h-full ${active === '/transacciones' ? 'border-b-2 border-white rounded-sm' : ''}`}
          onClick={() => handleSetActive('/transacciones')}
        >
          Transacciones
        </Link>
        <Link
          to="/comunidad"
          className={`text-white text-2xl font-bold p-2 flex items-center h-full ${active === '/comunidad' ? 'border-b-2 border-white rounded-sm' : ''}`}
          onClick={() => handleSetActive('/comunidad')}
        >
          Comunidad
        </Link>
      </nav>
      <div className="w-[20%] flex justify-end pr-8">
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
              }}
              className="transition-transform"
              description={user.email}
              name={user.name}
            />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{user.email}</p>
            </DropdownItem>
            <DropdownItem onPress={onOpen} key="settings">
              Settings
            </DropdownItem>
            <DropdownItem key="team_settings">Social</DropdownItem>
            <DropdownItem key="system">Help</DropdownItem>
            <DropdownItem onClick={handleLogout} key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Modal Title
                </ModalHeader>
                <ModalBody>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Magna exercitation reprehenderit magna aute tempor cupidatat
                    consequat elit dolor adipisicing. Mollit dolor eiusmod sunt
                    ex incididunt cillum quis. Velit duis sit officia eiusmod
                    Lorem aliqua enim laboris do dolor eiusmod. Et mollit
                    incididunt nisi consectetur esse laborum eiusmod pariatur
                    proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </header>
  );
};

export default Header;
