// DraggableRow.js
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

const DraggableRow = ({ index, moveRow, children }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'ROW',
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drop(ref);

  return (
    <tr ref={ref}>
      {children}
    </tr>
  );
};

export default DraggableRow;
