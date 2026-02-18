import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { View, PanResponder, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Move, RotateCcw, Trash2 } from "react-native-feather";
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export const DraggableContainer = (
  {
    x,
    y,
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    rotation,
    resizeMode,
    index,
    selected = false,
    draggable = true,
    rotable = true,
    resizable = true,
    zIndex = 9999,
    onSelect,
    onDelete,
    onDragStart,
    onDragRelease,
    onRotateStart,
    onRotateRelease,
    onResizeStart,
    onResizeRelease,
    children
  }) => {


  const isDevelopment = process.env.NODE_ENV === 'development';

  const FOUR_SQUARES = "4-squares";
  const ONE_SQUARE = "1-square";

  const item = useMemo(() => {
    return {
      height: height || minHeight || 100,
      width: width || minWidth || 100,
      rotation: rotation || 0,
      x: x || 0,
      y: y || 0,
    };
  }, [height, minHeight, width, minWidth, rotation]);

  const position = {
    x: useSharedValue(-1000),
    y: useSharedValue(-1000),
  };

  const originOffset = useRef({ oX: 0, oY: 0 });

  const contentView = {
    height: useSharedValue(item.height),
    width: useSharedValue(item.width),
    rotation: useSharedValue(item.rotation)
  };

  const initHeight = useSharedValue(0);
  const initWidth = useSharedValue(0);
  const initRotation = useSharedValue(0);

  const buttonsSize = 30;
  const [layoutKey, setLayoutKey] = useState(0);
  const dimensions = { width: useSharedValue(0), height: useSharedValue(0) };
  const windowDimensions = useRef(Dimensions.get('window'));
  const [buttonsAbove, setButtonsAbove] = useState(false);

  const checkButtonsPosition = useCallback(() => {
    const containerBottom = position.y.value + contentView.height.value;
    const windowHeight = windowDimensions.current.height;
    const threshold = windowHeight - 100;
    setButtonsAbove(containerBottom > threshold);
  }, [position.y, contentView.height]);

  const getNewPosition = useCallback((gestureState) => {
    let { moveX, moveY } = gestureState;
    let { height } = dimensions;
    let { oX, oY } = originOffset.current;
    return { x: moveX - oX, y: moveY - oY - height.value / 2 - buttonsSize * 1.5 };
  }, [dimensions]);

  const handleDrag = useCallback((gestureState) => {
    const { x, y } = getNewPosition(gestureState);
    position.x.value = x;
    position.y.value = y;
    if (!!item) {
      item.x = x;
      item.y = y;
    }
    checkButtonsPosition();
  }, [position, getNewPosition, checkButtonsPosition]);

  const dragViewpanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (_, gestureState) => {
        if(!!onDragStart) onDragStart(gestureState);
      },
      onPanResponderMove: (_, gestureState) => handleDrag(gestureState),
      onPanResponderRelease: (_, gestureState) => {
        if(!!onDragRelease) onDragRelease(gestureState);
      },
    })
  ).current;

  const handleResizeY = useCallback((gestureState, y0) => {
    let newValue = y0 ? gestureState.y0 - gestureState.moveY : gestureState.moveY - gestureState.y0;
    const newHeight = Math.max(newValue + initHeight.value, 25);

    if (!!minHeight && newHeight < minHeight) return;
    if (!!maxHeight && newHeight > maxHeight) return;

    contentView.height.value = newHeight;
    if (newHeight > 25 && y0)
      position.y.value = gestureState.moveY - (y0 ? -1 * buttonsSize / 2 : buttonsSize / 2);
    if (!!item)
      item.height = newHeight;
    checkButtonsPosition();
  }, [contentView, initHeight, checkButtonsPosition]);

  const resizeYViewpanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (_, gestureState) => {
        if(onResizeStart) onResizeStart(gestureState);
      },
      onPanResponderMove: (_, gestureState) => handleResizeY(gestureState, false),
      onPanResponderRelease: (_, gestureState) => {
        if(onResizeRelease) onResizeRelease(gestureState);
        initHeight.value = contentView.height.value;
        setLayoutKey((prevKey) => prevKey + 1);
      },
    })
  ).current;

  /*  Resize pandhandlers */

  const resizeYFinalViewpanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (_, gestureState) => {
        if(onResizeStart) onResizeStart(gestureState);
      },
      onPanResponderMove: (_, gestureState) => handleResizeY(gestureState, true),
      onPanResponderRelease: (_, gestureState) => {
        if(onResizeRelease) onResizeRelease(gestureState);
        initHeight.value = contentView.height.value;
        setLayoutKey((prevKey) => prevKey + 1);
      },
    })
  ).current;

  const handleResizeX = useCallback((gestureState, x0) => {
    let newValue = x0 ? gestureState.x0 - gestureState.moveX : gestureState.moveX - gestureState.x0;
    const newWidth = Math.max(newValue + initWidth.value, 25);
    if (!!minWidth && newWidth < minWidth) return;
    if (!!maxWidth && newWidth > maxWidth) return;

    contentView.width.value = newWidth;
    if (newWidth > 25 && x0)
      position.x.value = gestureState.moveX - (x0 ? -1 * buttonsSize / 2 : buttonsSize / 2);
    if (!!item)
      item.width = newWidth;
    checkButtonsPosition();
  }, [contentView, initWidth, checkButtonsPosition]);

  const resizeXViewpanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (_, gestureState) => {
        if(onResizeStart) onResizeStart(gestureState);
      },
      onPanResponderMove: (_, gestureState) => handleResizeX(gestureState, false),
      onPanResponderRelease: (_, gestureState) => {
        if(onResizeRelease) onResizeRelease(gestureState);
        initWidth.value = contentView.width.value;
        setLayoutKey((prevKey) => prevKey + 1);
      },
    })
  ).current;

  const resizeXFinalViewpanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (_, gestureState) => {
        if(onResizeStart) onResizeStart(gestureState);
      },
      onPanResponderMove: (_, gestureState) => handleResizeX(gestureState, true),
      onPanResponderRelease: (_, gestureState) => {
        if(onResizeRelease) onResizeRelease(gestureState);
        initWidth.value = contentView.width.value;
        setLayoutKey((prevKey) => prevKey + 1);
      },
    })
  ).current;

  const resizeXYFinalViewpanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        handleResizeY(gestureState, false);
        handleResizeX(gestureState, false);
      },
      onPanResponderRelease: (_, gestureState) => {
        initHeight.value = contentView.height.value;
        initWidth.value = contentView.width.value;
        setLayoutKey((prevKey) => prevKey + 1);
      },
    })
  ).current;

  /* Rotate functions */

  const onRotate = useCallback((gestureState) => {
    let newValue = gestureState.x0 - gestureState.moveX;
    contentView.rotation.value = newValue + initRotation.value;
    if (!!item)
      item.rotation = contentView.rotation.value;
  }, [contentView, initRotation]);

  const rotateViewpanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (_, gestureState) => {
        if(onRotateStart) onRotateStart(gestureState);
      },
      onPanResponderMove: (_, gestureState) => onRotate(gestureState),
      onPanResponderRelease: (_, gestureState) => {
        if(onRotateRelease) onRotateRelease(gestureState);
        initRotation.value = contentView.rotation.value;
      },
    })
  ).current;

  const dragAnimationStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.x.value },
      { translateY: position.y.value },
    ],
    position: 'absolute',
  }));

  useEffect(() => {
    position.x.value = item.x;
    position.y.value = item.y;

    initHeight.value = contentView.height.value;
    initWidth.value = contentView.width.value;
    initRotation.value = contentView.rotation.value;
    checkButtonsPosition();
  }, [item, checkButtonsPosition]);

  const onComponentLayout = useCallback((event) => {
    const { width, height, x, y, top, left } = event.nativeEvent.layout;
    originOffset.current = { oX: x + (left | 0) + width / 2, oY: y + (top | 0) + height / 2 };
    dimensions.width.value = width;
    dimensions.height.value = height;
    checkButtonsPosition();
  }, [dimensions, checkButtonsPosition]);

  // animated size style for the inner component shown
  const resizeAnimationStyle = useAnimatedStyle(() => ({
    height: contentView.height.value,
    width: contentView.width.value,
    maxWidth: contentView.width.value,
    maxHeight: contentView.height.value,
    backgroundColor: 'transparent',
    zIndex: zIndex - 1,
  }));

  // animated rotation style for the inner component shown
  const rotationAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: contentView.rotation.value + 'deg' }],
  }));

  // Componente hijo que queremos memorizar
  const childMemo = useMemo(() => children, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderWidth: 1,
          borderStyle: 'dashed',
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonsContainer: {
          position: 'absolute',
          bottom: -60,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingHorizontal: 10,
          zIndex: zIndex,
          elevation: zIndex,
        },
        buttonsAbove: {
          bottom: 'auto',
          top: -60,
        },
        button: {
          borderRadius: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: zIndex,
          zIndex: zIndex,
        },
        resizeHandles: {
          position: 'absolute',
          width: '100%',
          height: '100%',
        },
        resizeHandle: {
          position: 'absolute',
          width: 30,
          height: 30,
          backgroundColor: '#fa7f7c',
          borderRadius: 20,
          zIndex: zIndex,
          elevation: zIndex,
        },
        leftHandle: {
          left: -30,
          top: '50%',
          transform: [{ translateY: -10 }],
          zIndex: zIndex,
          elevation: zIndex,
        },
        rightHandle: {
          right: -30,
          top: '50%',
          transform: [{ translateY: -10 }],
          zIndex: zIndex,
          elevation: zIndex,
        },
        topHandle: {
          top: -30,
          left: '50%',
          transform: [{ translateX: -10 }],
          zIndex: zIndex,
          elevation: zIndex,
        },
        bottomHandle: {
          bottom: -30,
          left: '50%',
          transform: [{ translateX: -10 }],
          zIndex: zIndex,
          elevation: zIndex,
        },
        botRightHandle: {
          bottom: -15,
          right: -15,
          zIndex: zIndex,
          elevation: zIndex,
        }
      }),
    [zIndex]
  );

  return (
    <Animated.View
      selectable={false}
      draggable={false}
      style={[dragAnimationStyle, { zIndex: selected ? zIndex - 1 : 3 }]}
      key={`dragable-text-${index}-layoutKey-${layoutKey}`}
      onLayout={onComponentLayout}>
      <Pressable
        onPress={() => onSelect(index)}
        style={[styles.container, { borderColor: selected ? '#fa7f7c' : 'transparent' }]}
        draggable={false}
        selectable={false}>
        <Animated.View style={[rotationAnimationStyle, resizeAnimationStyle]}>
          {childMemo}
        </Animated.View>
        {/* Drag buttons */}
        {
          selected &&
          <View pointerEvents="box-none" style={[styles.buttonsContainer, buttonsAbove && styles.buttonsAbove]}>
            <View 
              {...(isDevelopment ? { testID: "rotateButton" } : {})} 
              {...rotateViewpanResponder.panHandlers} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              pointerEvents={rotable ? 'auto' : 'none'}
              style={[{ visibility: rotable ? 'visible' : 'hidden', width: buttonsSize, height: buttonsSize }, styles.button]}>
              <RotateCcw stroke="black" width={buttonsSize / 2} height={buttonsSize / 2} />
            </View>
            <View 
              {...(isDevelopment ? { testID: "moveButton" } : {})} 
              {...dragViewpanResponder.panHandlers} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              pointerEvents={draggable ? 'auto' : 'none'}
              style={[{ visibility: draggable ? 'visible' : 'hidden', width: buttonsSize, height: buttonsSize }, styles.button]}>
              <Move stroke="black" width={buttonsSize / 2} height={buttonsSize / 2} />
            </View>
            <Pressable 
              {...(isDevelopment ? { testID: "deleteButton" } : {})} 
              onPress={() => onDelete(index)} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[{ visibility: onDelete ? 'visible' : 'hidden', width: buttonsSize, height: buttonsSize }, styles.button]}>
              <Trash2 stroke="black" width={buttonsSize / 2} height={buttonsSize / 2} />
            </Pressable>
          </View>
        }
        {/* Resize 4 squares buttons */}
        {selected && resizeMode === FOUR_SQUARES && <View {...(isDevelopment ? { testID: "resizableButton-xf-square" } : {})} {...resizeXFinalViewpanResponder.panHandlers} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} pointerEvents={resizable ? 'auto' : 'none'} style={[{ visibility: resizable ? 'visible' : 'hidden', width: buttonsSize, height: buttonsSize }, styles.resizeHandle, styles.leftHandle]} />}
        {selected && resizeMode === FOUR_SQUARES && <View {...(isDevelopment ? { testID: "resizableButton-y-square" } : {})} {...resizeYViewpanResponder.panHandlers} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} pointerEvents={resizable ? 'auto' : 'none'} style={[{ visibility: resizable ? 'visible' : 'hidden', width: buttonsSize, height: buttonsSize }, styles.resizeHandle, styles.bottomHandle]} />}
        {selected && resizeMode === FOUR_SQUARES && <View {...(isDevelopment ? { testID: "resizableButton-x-square" } : {})} {...resizeXViewpanResponder.panHandlers} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} pointerEvents={resizable ? 'auto' : 'none'} style={[{ visibility: resizable ? 'visible' : 'hidden', width: buttonsSize, height: buttonsSize }, styles.resizeHandle, styles.rightHandle]} />}
        {selected && resizeMode === FOUR_SQUARES && <View {...(isDevelopment ? { testID: "resizableButton-yf-square" } : {})} {...resizeYFinalViewpanResponder.panHandlers} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} pointerEvents={resizable ? 'auto' : 'none'} style={[{ visibility: resizable ? 'visible' : 'hidden', width: buttonsSize, height: buttonsSize }, styles.resizeHandle, styles.topHandle]} />}
        {/* Resize 1 square button */}
        {selected && resizeMode === ONE_SQUARE && <View {...(isDevelopment ? { testID: "resizableButton-1-square" } : {})} {...resizeXYFinalViewpanResponder.panHandlers} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} pointerEvents={resizable ? 'auto' : 'none'} style={[{ visibility: resizable ? 'visible' : 'hidden', width: buttonsSize, height: buttonsSize }, styles.resizeHandle, styles.botRightHandle]} />}
      </Pressable>
    </Animated.View>
  );
};