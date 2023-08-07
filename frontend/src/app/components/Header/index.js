import React from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
  const { active } = props;

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  const menu = [
    {
      id: 'feedback',
      title: 'Feedback',
      active: active === 'feedback',
      onClick: () => navigate('/feedback'),
    },
    {
      id: 'trash',
      title: 'Trash Pickup',
      active: active === 'trash',
      onClick: () => navigate('/trash-pickup'),
    },
  ];

  return (
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
  );
};

export default Header;
