import { Badge, ListGroup } from 'react-bootstrap';

export default function Sidebar({ menuItems = [], activePage = '', onMenuClick }) {
  return (
    <aside className="bg-body-tertiary border-end h-100 p-3">
      <ListGroup variant="flush">
        {menuItems.map((item) => {
          const isActive = activePage === item.key;

          return (
            <ListGroup.Item
              action
              key={item.key}
              active={isActive}
              onClick={() => onMenuClick?.(item.key)}
              className="d-flex align-items-center justify-content-between gap-3"
            >
              <span>{item.label}</span>
              {item.badge ? <Badge bg={isActive ? 'light' : 'secondary'} text={isActive ? 'dark' : undefined}>{item.badge}</Badge> : null}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </aside>
  );
}
