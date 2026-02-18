import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DraggableContainer } from '../src/components/DraggableContainer';
import { Text } from 'react-native';

describe('DraggableContainer', () => {
  let mockOnSelect;
  let mockOnDelete;
  let mockOnDragStart;
  let mockOnDragRelease;
  let mockOnRotateStart;
  let mockOnRotateRelease;
  let mockOnResizeStart;
  let mockOnResizeRelease;

  const defaultProps = {
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    rotation: 0,
    resizeMode: '1-square',
    index: 0,
    selected: true,
    onSelect: jest.fn(),
    onDelete: jest.fn(),
    draggable: true,
    rotable: true,
    resizable: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSelect = jest.fn();
    mockOnDelete = jest.fn();
    mockOnDragStart = jest.fn();
    mockOnDragRelease = jest.fn();
    mockOnRotateStart = jest.fn();
    mockOnRotateRelease = jest.fn();
    mockOnResizeStart = jest.fn();
    mockOnResizeRelease = jest.fn();
  });

  describe('Renderizado', () => {
    it('renderiza correctamente con children', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps}>
          <Text testID="child">Child Component</Text>
        </DraggableContainer>
      );
      expect(getByTestId('child')).toBeTruthy();
    });

    it('renderiza sin children', () => {
      const { toJSON } = render(
        <DraggableContainer {...defaultProps} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('renderiza múltiples children', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps}>
          <Text testID="child1">Child 1</Text>
          <Text testID="child2">Child 2</Text>
        </DraggableContainer>
      );
      expect(getByTestId('child1')).toBeTruthy();
      expect(getByTestId('child2')).toBeTruthy();
    });
  });

  describe('Eventos de selección', () => {
    it('llama onSelect con el index correcto al presionar', () => {
      const { getByText } = render(
        <DraggableContainer {...defaultProps} index={5} onSelect={mockOnSelect}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      fireEvent.press(getByText('Content'));
      expect(mockOnSelect).toHaveBeenCalledWith(5);
    });

    it('llama onSelect con index 0 por defecto', () => {
      const { getByText } = render(
        <DraggableContainer {...defaultProps} index={0} onSelect={mockOnSelect}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      fireEvent.press(getByText('Content'));
      expect(mockOnSelect).toHaveBeenCalledWith(0);
    });
  });

  describe('Eventos de eliminación', () => {
    it('llama onDelete con el index correcto al presionar delete', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} index={3} onDelete={mockOnDelete}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      fireEvent.press(getByTestId('deleteButton'));
      expect(mockOnDelete).toHaveBeenCalledWith(3);
    });

    it('no llama onDelete si no está definido', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} onDelete={undefined}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      const deleteButton = getByTestId('deleteButton');
      expect(deleteButton).toHaveStyle({ visibility: 'hidden' });
    });
  });

  describe('Eventos de arrastre', () => {
    it('muestra botón de mover cuando draggable es true y selected es true', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} draggable={true} selected={true}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toBeTruthy();
    });

    it('oculta botón de mover cuando draggable es false', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} draggable={false}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      const moveButton = getByTestId('moveButton');
      expect(moveButton).toHaveStyle({ visibility: 'hidden' });
    });

    it('no muestra botón de mover cuando selected es false', () => {
      const { queryByTestId } = render(
        <DraggableContainer {...defaultProps} selected={false} draggable={true}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(queryByTestId('moveButton')).toBeNull();
    });
  });

  describe('Eventos de rotación', () => {
    it('muestra botón de rotar cuando rotable es true y selected es true', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} rotable={true} selected={true}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      const rotateButton = getByTestId('rotateButton');
      expect(rotateButton).toHaveStyle({ visibility: 'visible' });
    });

    it('oculta botón de rotar cuando rotable es false', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} rotable={false}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      const rotateButton = getByTestId('rotateButton');
      expect(rotateButton).toHaveStyle({ visibility: 'hidden' });
    });

    it('no muestra botón de rotar cuando selected es false', () => {
      const { queryByTestId } = render(
        <DraggableContainer {...defaultProps} selected={false} rotable={true}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(queryByTestId('rotateButton')).toBeNull();
    });
  });

  describe('Eventos de redimensionamiento - modo 1-square', () => {
    it('muestra botón de resize cuando resizable es true y selected es true', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} resizable={true} selected={true} resizeMode="1-square">
          <Text>Content</Text>
        </DraggableContainer>
      );
      const resizeButton = getByTestId('resizableButton-1-square');
      expect(resizeButton).toHaveStyle({ visibility: 'visible' });
    });

    it('oculta botón de resize cuando resizable es false', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} resizable={false} resizeMode="1-square">
          <Text>Content</Text>
        </DraggableContainer>
      );
      const resizeButton = getByTestId('resizableButton-1-square');
      expect(resizeButton).toHaveStyle({ visibility: 'hidden' });
    });

    it('no muestra botón de resize cuando selected es false', () => {
      const { queryByTestId } = render(
        <DraggableContainer {...defaultProps} selected={false} resizable={true} resizeMode="1-square">
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(queryByTestId('resizableButton-1-square')).toBeNull();
    });
  });

  describe('Eventos de redimensionamiento - modo 4-squares', () => {
    it('muestra los 4 botones de resize cuando resizable es true y selected es true', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} resizable={true} selected={true} resizeMode="4-squares">
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('resizableButton-xf-square')).toHaveStyle({ visibility: 'visible' });
      expect(getByTestId('resizableButton-y-square')).toHaveStyle({ visibility: 'visible' });
      expect(getByTestId('resizableButton-x-square')).toHaveStyle({ visibility: 'visible' });
      expect(getByTestId('resizableButton-yf-square')).toHaveStyle({ visibility: 'visible' });
    });

    it('oculta los 4 botones de resize cuando resizable es false', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} resizable={false} resizeMode="4-squares">
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('resizableButton-xf-square')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('resizableButton-y-square')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('resizableButton-x-square')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('resizableButton-yf-square')).toHaveStyle({ visibility: 'hidden' });
    });

    it('no muestra los 4 botones de resize cuando selected es false', () => {
      const { queryByTestId } = render(
        <DraggableContainer {...defaultProps} selected={false} resizable={true} resizeMode="4-squares">
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(queryByTestId('resizableButton-xf-square')).toBeNull();
      expect(queryByTestId('resizableButton-y-square')).toBeNull();
      expect(queryByTestId('resizableButton-x-square')).toBeNull();
      expect(queryByTestId('resizableButton-yf-square')).toBeNull();
    });
  });

  describe('Visibilidad de botones según estado selected', () => {
    it('no muestra ningún botón cuando selected es false', () => {
      const { queryByTestId } = render(
        <DraggableContainer
          {...defaultProps}
          selected={false}
          draggable={true}
          rotable={true}
          resizable={true}
          onDelete={mockOnDelete}
        >
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(queryByTestId('moveButton')).toBeNull();
      expect(queryByTestId('rotateButton')).toBeNull();
      expect(queryByTestId('deleteButton')).toBeNull();
      expect(queryByTestId('resizableButton-1-square')).toBeNull();
    });

    it('muestra todos los botones cuando selected es true y todas las features habilitadas', () => {
      const { getByTestId } = render(
        <DraggableContainer
          {...defaultProps}
          selected={true}
          draggable={true}
          rotable={true}
          resizable={true}
          onDelete={mockOnDelete}
          resizeMode="1-square"
        >
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toBeTruthy();
      expect(getByTestId('rotateButton')).toHaveStyle({ visibility: 'visible' });
      expect(getByTestId('deleteButton')).toHaveStyle({ visibility: 'visible' });
      expect(getByTestId('resizableButton-1-square')).toHaveStyle({ visibility: 'visible' });
    });
  });

  describe('Visibilidad del botón delete', () => {
    it('muestra delete button cuando onDelete está definido', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} onDelete={mockOnDelete}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('deleteButton')).toHaveStyle({ visibility: 'visible' });
    });

    it('oculta delete button cuando onDelete no está definido', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} onDelete={undefined}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('deleteButton')).toHaveStyle({ visibility: 'hidden' });
    });
  });

  describe('Valores por defecto de props', () => {
    it('usa valores por defecto correctamente', () => {
      const { getByTestId } = render(
        <DraggableContainer
          selected={true}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        >
          <Text testID="child">Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('child')).toBeTruthy();
    });

    it('funciona sin propiedades opcionales', () => {
      const { toJSON } = render(
        <DraggableContainer>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Props de dimensiones', () => {
    it('acepta minWidth y minHeight', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} minWidth={50} minHeight={50}>
          <Text testID="child">Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('child')).toBeTruthy();
    });

    it('acepta maxWidth y maxHeight', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} maxWidth={300} maxHeight={300}>
          <Text testID="child">Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('child')).toBeTruthy();
    });

    it('acepta posición inicial x e y', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} x={100} y={200}>
          <Text testID="child">Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('child')).toBeTruthy();
    });

    it('acepta rotación inicial', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} rotation={45}>
          <Text testID="child">Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('child')).toBeTruthy();
    });
  });

  describe('Cambios de resizeMode', () => {
    it('renderiza correctamente con resizeMode "1-square"', () => {
      const { getByTestId, queryByTestId } = render(
        <DraggableContainer {...defaultProps} resizeMode="1-square">
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('resizableButton-1-square')).toBeTruthy();
      expect(queryByTestId('resizableButton-xf-square')).toBeNull();
    });

    it('renderiza correctamente con resizeMode "4-squares"', () => {
      const { getByTestId, queryByTestId } = render(
        <DraggableContainer {...defaultProps} resizeMode="4-squares">
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(queryByTestId('resizableButton-1-square')).toBeNull();
      expect(getByTestId('resizableButton-xf-square')).toBeTruthy();
    });
  });

  describe('Combinaciones de features', () => {
    it('permite solo drag cuando rotable y resizable son false', () => {
      const { getByTestId, queryByTestId } = render(
        <DraggableContainer
          {...defaultProps}
          draggable={true}
          rotable={false}
          resizable={false}
        >
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toBeTruthy();
      expect(getByTestId('rotateButton')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('resizableButton-1-square')).toHaveStyle({ visibility: 'hidden' });
    });

    it('permite solo rotate cuando draggable y resizable son false', () => {
      const { getByTestId } = render(
        <DraggableContainer
          {...defaultProps}
          draggable={false}
          rotable={true}
          resizable={false}
        >
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('rotateButton')).toHaveStyle({ visibility: 'visible' });
      expect(getByTestId('resizableButton-1-square')).toHaveStyle({ visibility: 'hidden' });
    });

    it('permite solo resize cuando draggable y rotable son false', () => {
      const { getByTestId } = render(
        <DraggableContainer
          {...defaultProps}
          draggable={false}
          rotable={false}
          resizable={true}
        >
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('rotateButton')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('resizableButton-1-square')).toHaveStyle({ visibility: 'visible' });
    });

    it('deshabilita todas las features cuando todas son false', () => {
      const { getByTestId } = render(
        <DraggableContainer
          {...defaultProps}
          draggable={false}
          rotable={false}
          resizable={false}
        >
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('rotateButton')).toHaveStyle({ visibility: 'hidden' });
      expect(getByTestId('resizableButton-1-square')).toHaveStyle({ visibility: 'hidden' });
    });
  });

  describe('Prop zIndex', () => {
    it('usa zIndex por defecto (9999) cuando no se especifica', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toHaveStyle({ zIndex: 9999 });
      expect(getByTestId('rotateButton')).toHaveStyle({ zIndex: 9999 });
      expect(getByTestId('resizableButton-1-square')).toHaveStyle({ zIndex: 9999 });
    });

    it('usa zIndex personalizado cuando se especifica', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} zIndex={500}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toHaveStyle({ zIndex: 500 });
      expect(getByTestId('rotateButton')).toHaveStyle({ zIndex: 500 });
      expect(getByTestId('resizableButton-1-square')).toHaveStyle({ zIndex: 500 });
    });

    it('aplica zIndex a los botones de resize en modo 4-squares', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} resizeMode="4-squares" zIndex={100}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('resizableButton-xf-square')).toHaveStyle({ zIndex: 100 });
      expect(getByTestId('resizableButton-y-square')).toHaveStyle({ zIndex: 100 });
      expect(getByTestId('resizableButton-x-square')).toHaveStyle({ zIndex: 100 });
      expect(getByTestId('resizableButton-yf-square')).toHaveStyle({ zIndex: 100 });
    });

    it('aplica elevation igual que zIndex para Android', () => {
      const { getByTestId } = render(
        <DraggableContainer {...defaultProps} zIndex={750}>
          <Text>Content</Text>
        </DraggableContainer>
      );
      expect(getByTestId('moveButton')).toHaveStyle({ elevation: 750 });
      expect(getByTestId('rotateButton')).toHaveStyle({ elevation: 750 });
    });
  });
});
