import React from 'react';
import {
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes/route-map';
import { checkMobile } from '../../utils/utils';

const Header = (props) => {
  const { active } = props;

  const navigate = useNavigate();

  const isMobile = checkMobile();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleBack = () => {
    navigate('/home');
  };

  const menu = routes
    .filter((item) => item.menu)
    .map((item) => {
      return {
        ...item,
        active: active === item.id,
        onClick: () => navigate(`/${item.path}`),
      };
    });

  return (
    <>
      {isMobile ? (
        <>
          <Flex w="100%" h="50px" justify="end">
            <Button w="50px" h="50px" right="50px" bg="white" onClick={onOpen}>
              <HamburgerIcon />
            </Button>
          </Flex>
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody>
                <Flex w="100%" h="100%" flexDirection={`column`} align="center">
                  <div className="headerTitle-mobile" onClick={handleBack}>
                    <div>Evolution</div>
                  </div>
                  {menu.map((item) => (
                    <Button
                      key={item.id}
                      size="sm"
                      m="20px 0"
                      colorScheme={item.active ? 'blue' : 'gray'}
                      onClick={item.onClick}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
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
                  colorScheme={item.active ? 'blue' : 'gray'}
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
