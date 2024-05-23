import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import astroLogo from "../assets/icon.svg";
import { Tabs, Tab } from "@nextui-org/tabs";
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

  const moveTransacciones = () => {
    navigate("/transacciones");
  }
  const moveDashboard = () => {
    navigate("/dashboard");
  }
  const moveManage = () => {
    navigate("/manage");
  }

  return (
    <header className="w-full h-[10%] flex items-center justify-between">
      <div className="flex items-center w-[20%] justify-center">
        <img src={astroLogo} alt="" className="w-12" />
        <h2 className="logoText font-bold text-4xl text-[#ffea00] select-none">
          AstroWallet
        </h2>
      </div>
      <Tabs variant="solid" size="lg">
        <Tab onClick={moveDashboard} title="Dashboard" />
        <Tab onClick={moveTransacciones} title="Transacciones" />
        <Tab onClick={moveManage} title="Manage" />
      </Tabs>
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
