import React, { ReactChild, useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';


export interface MenuItem {
  key: string;
  content: string | ReactChild;
  items?: MenuItem[];
}

interface SubMenuProps {
  className?: string;
  items: MenuItem[];
  level?: number;
  prefix?: string[];
  selectedKeys: string[];
  subMenuPlacement?: 'within' | 'after';
  onItemSelected: (keys: string[]) => void;
}

const SubMenu: React.FC<SubMenuProps> = (props) => {
  const level = props.level ?? 0;
  const prefix = props.prefix ?? [];
  const selectedItem = props.items.filter(item => item.key === props.selectedKeys[level])[0];
  const subMenuPlacement = props.subMenuPlacement ?? 'within';

  const handleItemClicked = (item: MenuItem) => {
    props.onItemSelected(item.items ? [...prefix, item.key] : []);
  };

  const className = props.className ?? 'menu';

  const renderSubMenu = () => {
    return selectedItem.items && (
      <div className={`${className}__submenu-container ${className}__submenu-container--level-${level}`}>
        <SubMenu {...props} items={selectedItem.items} prefix={[...prefix, selectedItem.key]} level={level + 1} />
      </div>
    );
  };

  return (
    <div className={`${className} ${className}--level-${level}`}>
      <ul className={`${className}__item-list ${className}__item-list--level-${level}`}>
        {props.items.map(item => (
          <li key={item.key} className={`${className}__item ${className}__item--level-${level}`}>
            <div className={`${className}__item-content ${className}__item-content--level-${level}`} onClick={() => handleItemClicked(item)}>
              {item.content}
            </div>
            {subMenuPlacement === 'within' && item === selectedItem && renderSubMenu()}
          </li>
        ))}
      </ul>
      {subMenuPlacement === 'after' && selectedItem && renderSubMenu()}
    </div>
  );
}

interface MenuProps {
  className?: string;
  items: MenuItem[];
  selectedKeys?: string[];
  subMenuPlacement?: 'within' | 'after';
  onOutsideClicked?: () => void;
  onItemSelected?: (keys: string[]) => void;
}

export const Menu: React.FC<MenuProps> = (props) => {
  const ref = React.useRef(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleItemSelected = (keys: string[]) => {
    props.onItemSelected
      ? props.onItemSelected(keys)
      : setSelectedKeys(keys);
  };

  useOnClickOutside(ref, () => {
    props.onOutsideClicked ? props.onOutsideClicked() : handleItemSelected([]);
  });

  const className = props.className ?? 'menu';

  return (
    <div className={`${className} ${className}__menu-container`} ref={ref}>
      <SubMenu
        className={props.className}
        items={props.items}
        selectedKeys={props.selectedKeys ?? selectedKeys}
        onItemSelected={handleItemSelected}
        subMenuPlacement={props.subMenuPlacement}
      />
    </div>
  );
}
