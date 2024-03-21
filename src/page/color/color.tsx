import React from "react";
import ColorPicker from "../../components/colorPicker";
import './index.scss';

/**
 * 颜色
 */
function ColorStyle () {
    return <div className='color-style-container'>
        <ColorPicker/>
    </div>;
}

export default ColorStyle;
