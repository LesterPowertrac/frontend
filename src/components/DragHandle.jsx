// DragHandle.js
import React from 'react';
import { useDrag } from 'react-dnd';

const DragHandle = ({ index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ROW',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <td
      ref={drag}
      style={{
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
        width: '30px', // Adjust as needed
      }}
    >
       🖐️ {index + 1}
    </td>
  );
};

export default DragHandle;
