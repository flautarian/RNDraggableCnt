# 🎨 DraggableContainer

`DraggableContainer` is a versatile React Native component that allows you to create draggable, resizable, and rotatable containers. It's built using `react-native-reanimated` for smooth animations and `react-native-feather` for icons. This component is perfect for applications that require dynamic and interactive UI elements.

## ✨Features

- **Drag and Drop**: 👆 Easily move the container around the screen.
- **Resize**: ↔️ Adjust the width and height of the container using handles.
- **Rotate**: 🔄 Rotate the container to any angle.
- **Customizable**: 🎨 Highly customizable with various props to control behavior and appearance.
- **Callbacks**: 🔔 Provides callbacks for various events like drag start, drag end, resize start, resize end, etc.

## 🛠️Installation

To use the `DraggableContainer` component, you need to install the following dependencies:

- `react-native-reanimated`
- `react-native-feather`

Make sure you have `react-native-gesture-handler` installed and configured, as it is a peer dependency of `react-native-reanimated`.

## ⚙️Props

The `DraggableContainer` component accepts the following props:

| Prop               | Type      | Default     | Description                                                                 |
|--------------------|-----------|-------------|-----------------------------------------------------------------------------|
| `x`                | `number`  | `0`         | Initial x position of the container.                                       |
| `y`                | `number`  | `0`         | Initial y position of the container.                                       |
| `height`           | `number`  | `100`       | Initial height of the container.                                          |
| `minHeight`        | `number`  | `25`        | Minimum height of the container.                                          |
| `maxHeight`        | `number`  | `-`         | Maximum height of the container.                                          |
| `width`            | `number`  | `100`       | Initial width of the container.                                           |
| `minWidth`         | `number`  | `25`        | Minimum width of the container.                                           |
| `maxWidth`         | `number`  | `-`         | Maximum width of the container.                                           |
| `rotation`         | `number`  | `0`         | Initial rotation of the container in degrees.                              |
| `resizeMode`       | `string`  | `"4-squares"` | Resize mode: "4-squares" or "1-square".                                 |
| `index`            | `number`  | `-`         | Index of the container (useful for identifying the container).            |
| `selected`         | `boolean` | `false`     | Whether the container is selected.                                        |
| `draggable`        | `boolean` | `true`      | Whether the container can be dragged. Move button is enabled if this function is defined.|
| `rotable`          | `boolean` | `true`      | Whether the container can be rotated. Drag button is enabled if this function is defined.|
| `resizable`        | `boolean` | `true`      | Whether the container can be resized. Resize buttons are enabled if this function is defined.|
| `zIndex`           | `number`  | `9999`      | z-index for buttons and resize handles. Set a lower value if you need other elements above.|
| `onSelect`         | `function`| `-`         | Callback when the container is selected.                                  |
| `onDelete`         | `function`| `-`         | Callback when the delete button is pressed, delete button is enabled if this function is defined.|
| `onDragStart`      | `function`| `-`         | Callback when dragging starts.                                            |
| `onDragRelease`    | `function`| `-`         | Callback when dragging ends.                                              |
| `onRotateStart`    | `function`| `-`         | Callback when rotation starts.                                            |
| `onRotateRelease`  | `function`| `-`         | Callback when rotation ends.                                              |
| `onResizeStart`    | `function`| `-`         | Callback when resizing starts.                                            |
| `onResizeRelease`  | `function`| `-`         | Callback when resizing ends.                                              |
| `children`         | `node`    | `-`         | Child components to be rendered inside the container.                      |

## 🌟Example Usage

Here's an example of how to use the `DraggableContainer` component:

```jsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { DraggableContainer } from './path-to-your-component'; // Adjust the path as necessary

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DraggableContainer
        style={{ width: 100, height: 100, backgroundColor: 'blue' }}
        x={100}
        y={100}
        rotation={0}
        minWidth={50}
        minHeight={50}
        maxWidth={300}
        maxHeight={300}
        selected={true}
        resizeMode="4-squares"
        onDragEnd={(position) => {
          console.log('Drag ended at:', position);
        }}
        onDragStart={() => {
          console.log('Drag started');
        }}
        onDragRelease={(position) => {
          console.log('Dragging at:', position);
        }}
        onRotateStart={() => {
          console.log('Rotation started');
        }
        }
        onRotateRelease={(rotation) => {
          console.log('Rotation ended at:', rotation);
        }}
        onResizeStart={() => {
          console.log('Resize started');
        }
        }
        onResizeRelease={(size) => {
          console.log('Resizing ended at:', size);
        }}
        onSelect={() => {
          console.log('Selected');
        }
        }
        onDelete={() => {
          console.log('Deleted');
        }
        }
      >
        <Text class={styles.text}>Houdy! I can move</Text>
      </DraggableContainer>
    </View>
  );
};

export default App;
```

### 4-squares mode
<p align="center">
<img src="https://github.com/user-attachments/assets/ba9e5bc6-f895-414c-8f15-e2101e2531f0" width=400px height=400px center>
</p>


### 1-square mode
<p align="center">
<img src="https://github.com/user-attachments/assets/35e3cb61-d868-4997-9c91-0c45f2ce89b6" width=400px height=400px center>
</p>

## 🤝Contributing

Contributions are welcome! Please open an issue or submit a pull request, and let a 🌟 if you liked my work! 🤗

## 📜License

This project is licensed under the MIT License.



