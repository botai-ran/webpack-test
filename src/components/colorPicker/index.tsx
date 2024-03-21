import React, { useEffect, useRef } from 'react';
import { hex2rgb, hsv2rgb, Hsva, rgb2hex, rgb2hsv, Rgba } from './action';
import './index.scss';

interface ColorPickerProps {
    /** 颜色值 */
    value?: string;
    /** 颜色值的改变 */
    onChange?: (color: string) => void;
}
// 画板滑块半径
const drawBoardThumbRadius = 6;
// 色阶柱滑块半径
const colorLevelThumbRadius = 8;

/**
 *选择颜色的弹出框
 */
function ColorPicker ({
    value = '#e4bd18',
    onChange,
}: ColorPickerProps): JSX.Element {
    /** 画板 */
    const drawBoardRef =  useRef();
    /** 画板滑块 */
    const drawBoardThumbRef =  useRef();
    /** 色阶柱 */
    const colorLevelRef = useRef();
    /** 色阶柱滑块 */
    const colorLevelThumbRef = useRef();
    /** 当前颜色的hsv */
    const curColorHsv = useRef<Hsva>();

    useEffect(() => {
        init(value);
    }, [value]);

    const init = (color: string): void => {
        // hex 转 hsv
        const rgb: Rgba = hex2rgb(color);
        const hsv: Hsva = rgb2hsv(rgb.red, rgb.green, rgb.blue);
        curColorHsv.current = hsv;
        setDrawBoard(hsv);
        setDrawBoardThumb(color, hsv);
        setColorLevelThumb(hsv);
    };

    /**
     * 设置画板
     */
    const setDrawBoard = (hsv: Hsva): void => {
        // 背景画板
        const drawBoard: HTMLElement = drawBoardRef.current;
        // 设置背景画板的颜色
        drawBoard.style.backgroundColor = `hsl(${hsv.hue}, 100%, 50%)`;
    };

    /*
     * 设置画板滑块的颜色位置
     */
    const setDrawBoardThumb = (color: string, hsv: Hsva): void => {
        const drawBoardThumb: HTMLElement = drawBoardThumbRef.current;
        // 背景画板
        const drawBoard: HTMLElement = drawBoardRef.current;
        // 获取画板的宽高
        const { width, height } = drawBoard.getBoundingClientRect();

        const pX = hsv.saturation * width;
        const pY = (1 - hsv.value) * height;

        drawBoardThumb.style.top = `${pY - drawBoardThumbRadius}px`;
        drawBoardThumb.style.left = `${pX - drawBoardThumbRadius}px`;
        drawBoardThumb.style.backgroundColor = color;
    };


    /*
     * 设置色阶柱滑块
     */
    const setColorLevelThumb = (hsv: Hsva): void => {
        const colorLevelThumb: HTMLElement = colorLevelThumbRef.current;
        // 色阶柱
        const colorLevel: HTMLElement = colorLevelRef.current;
        // 色阶柱的宽
        const { width } = colorLevel.getBoundingClientRect();

        const pX = width * (hsv.hue / 360);
        const color = `hsl(${hsv.hue}, 100%, 50%)`;

        colorLevelThumb.style.left = `${pX - colorLevelThumbRadius}px`;
        colorLevelThumb.style.backgroundColor = color;
    };

    /**
     * 设置颜色画板
     */
    const handleDrawBoardMouseDown: React.MouseEventHandler<HTMLDivElement> = (event): void => {
        const drawBoard: HTMLElement = drawBoardRef.current;
        const drawBoardThumb: HTMLElement = drawBoardThumbRef.current;

        // 鼠标按下时，记录初始位置和鼠标按下时的光标位置
        const { width = 0, height = 0, top = 0, left = 0 } = drawBoard.getBoundingClientRect() || {};

        const initTop = top + drawBoardThumbRadius;
        const initLeft = left + drawBoardThumbRadius;

        const dragElement = (event: any): void => {
            // 计算鼠标移动的距离
            let deltaX = event.clientX - initLeft;
            let deltaY = event.clientY - initTop;
            // 根据鼠标移动的距离对元素进行位置调整
            if (deltaX < -drawBoardThumbRadius) {
                deltaX = -drawBoardThumbRadius;
            }
            if (deltaY < -drawBoardThumbRadius) {
                deltaY = -drawBoardThumbRadius;
            }
            if (deltaX >= width - drawBoardThumbRadius)  {
                deltaX = width - drawBoardThumbRadius;
            }
            if (deltaY >= height - drawBoardThumbRadius) {
                deltaY = height - drawBoardThumbRadius;
            }

            drawBoardThumb.style.left = `${deltaX}px`;
            drawBoardThumb.style.top = `${deltaY}px`;

            // 颜色计算
            const hue = curColorHsv.current.hue;
            const saturation = Math.round(deltaX / width * 100) / 100;
            const value = Math.round((1 - (deltaY / height)) * 100) / 100;

            curColorHsv.current = { hue, saturation, value };
            const { red, green, blue } = hsv2rgb(hue, saturation, value);
            drawBoardThumb.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

            const hex = rgb2hex(red, green, blue);
            onChange && onChange(hex);
        };

        // 点击时设置
        dragElement(event);

        const stopDragging = (): void => {
            // 移除鼠标移动事件监听器和鼠标抬起事件监听器
            window.removeEventListener('mousemove', dragElement);
            window.removeEventListener('mouseup', stopDragging);
        };

        // 添加鼠标移动事件监听器，用于移动元素
        window.addEventListener('mousemove', dragElement);
        // 添加鼠标抬起事件监听器，用于停止移动元素
        window.addEventListener('mouseup', stopDragging);
    };

    /**
     * 色阶柱滑块移动
     * @param event
     */
    const handleColorLevelMouseDown: React.MouseEventHandler<HTMLDivElement> = (event): void => {
        const colorLevel: HTMLElement = colorLevelRef.current;
        const colorLevelThumb: HTMLElement = colorLevelThumbRef.current;
        const drawBoard: HTMLElement = drawBoardRef.current;
        const drawBoardThumb: HTMLElement = drawBoardThumbRef.current;

        // 鼠标按下时，记录初始位置和鼠标按下时的光标位置
        const { width = 0, left = 0 } = colorLevel.getBoundingClientRect() || {};

        const initLeft = left + drawBoardThumbRadius;

        const dragElement = (event: any): void => {
            // 计算鼠标移动的距离
            let deltaX = event.clientX - initLeft;
            // 根据鼠标移动的距离对元素进行位置调整
            if (deltaX < -drawBoardThumbRadius) {
                deltaX = -drawBoardThumbRadius;
            }
            if (deltaX >= width - drawBoardThumbRadius)  {
                deltaX = width - drawBoardThumbRadius;
            }

            const hue = Math.round(((deltaX + drawBoardThumbRadius) / width) * 360 * 100) / 100;
            // 设置色阶柱滑块颜色位置
            colorLevelThumb.style.left = `${deltaX}px`;
            colorLevelThumb.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            // 设置画板的颜色
            drawBoard.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

            curColorHsv.current = { ...curColorHsv.current, hue };

            const { red, green, blue } =  hsv2rgb(curColorHsv.current.hue, curColorHsv.current.saturation, curColorHsv.current.value);
            // 设置画板滑块的颜色
            drawBoardThumb.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

            const hex = rgb2hex(red, green, blue);
            onChange && onChange(hex);

        };

        // 点击时设置
        dragElement(event);

        const stopDragging = (): void => {
            // 移除鼠标移动事件监听器和鼠标抬起事件监听器
            window.removeEventListener('mousemove', dragElement);
            window.removeEventListener('mouseup', stopDragging);
        };

        // 添加鼠标移动事件监听器，用于移动元素
        window.addEventListener('mousemove', dragElement);
        // 添加鼠标抬起事件监听器，用于停止移动元素
        window.addEventListener('mouseup', stopDragging);
    };

    // @ts-ignore
    return <div className='pick-color-container'>
        {/* 颜色面板 */}
        <div className='draw-board-content' ref={drawBoardRef} onMouseDown={handleDrawBoardMouseDown}>
            {/* 滑块 */}
            <div className="draw-board-thumb" ref={drawBoardThumbRef}></div>
        </div>
        {/* 色阶柱 */}
        <div className='color-level-content' ref={colorLevelRef} onMouseDown={handleColorLevelMouseDown}>
            {/* 滑块 */}
            <div className="color-level-thumb" ref={colorLevelThumbRef}></div>
        </div>

        {/* 透明度柱 */}
        <div className='color-transparent-content' >
            <div className="color-level-thumb" ></div>
        </div>
    </div>;
}

export default ColorPicker;
