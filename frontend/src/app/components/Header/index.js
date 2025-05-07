import React from "react";
import { Flex, Button, Drawer, Portal, useDisclosure } from "@chakra-ui/react";
// import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { checkMobile } from "../../utils/utils";
import { blue1 } from "../../utils/constants";

const Header = (props) => {
  const { active } = props;

  const navigate = useNavigate();

  const isMobile = checkMobile();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleBack = () => {
    navigate("/home");
  };

  const menu = [
    {
      id: "trash",
      title: "Trash Pickup",
      active: active === "trash",
      onClick: () => navigate(`/trash-pickup`),
    },
    {
      id: "feedback",
      title: "Feedback",
      active: active === "feedback",
      onClick: () => navigate(`/feedback`),
    },
  ];

  return (
    <>
      {isMobile ? (
        <>
          <Drawer.Root isOpen={isOpen}>
            <Drawer.Trigger asChild>
              <Flex direction="row" align="end" justify="end">
                <Button w="100px" h="50px" m="20px" bg="black" onClick={onOpen}>
                  Menu
                </Button>
              </Flex>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Flex
                    w="100%"
                    h="100%"
                    flexDirection={`column`}
                    align="center"
                  >
                    <div className="headerTitle-mobile" onClick={handleBack}>
                      <div>Evolution</div>
                    </div>
                    <Drawer.CloseTrigger asChild>
                      <Button w="50px" h="50px" onClick={onClose}>
                        x
                      </Button>
                    </Drawer.CloseTrigger>
                    {menu.map((item) => (
                      <Button
                        key={item.id}
                        size="sm"
                        m="20px 0"
                        bgColor={`${item.active ? blue1 : "gray"}`}
                        onClick={item.onClick}
                      >
                        {item.title}
                      </Button>
                    ))}
                  </Flex>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </>
      ) : (
        <div className="navContainer">
          <div className="headerTitle" onClick={handleBack}>
            <span>Evolution</span>
          </div>
          <div className="nav-bar">
            <div className="navInner">
              {menu.map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  bgColor={item.active ? "#3182ce" : "gray"}
                  onClick={item.onClick}
                >
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
