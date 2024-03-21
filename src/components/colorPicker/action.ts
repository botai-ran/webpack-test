// 颜色转换相关算法
// https://jsfiddle.net/Lamik/9rky6fco/
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately

//  双取反运算符 ~~

export interface Hsva {
    hue: number;
    saturation: number;
    value: number;
    alpha?: number;
}

export interface Rgba {
    red: number;
    green: number;
    blue: number;
    alpha?: number;
}


export const HEX_REG = /^#([a-f\d]{3}|[a-f\d]{6})$/i;

export const RGB_REG = /^rgba?\s?\(/i;

export const HSL_REG = /^hsla?\s?\(/i;

export const HSV_REG = /^hsva?\s?\(/i;

const parseAlpha = (alpha: number): number => (alpha !== void 0 && !isNaN(+alpha) && 0 <= +alpha && +alpha <= 1 ? +alpha : 1);

/**
 * 将给定的 value 值限定在 0 到 max 之间，并返回一个归一化的值
 * @param value
 * @param max
 */
function boundValue (value: number, max: number): number {
    value = Math.min(max, Math.max(0, value));
    if ((Math.abs(value - max) < 0.000001)) {
        return 1;
    }
    return (value % max) / (~~max);
}

/**
 * h.s.v. 转换为 r.g.b
 * @param hue 色相值
 * @param saturation 饱和度
 * @param value 明度
 */
export const hsv2rgb = (hue: number, saturation: number, value: number): { red: number; green: number; blue: number } => {
    hue = boundValue(hue, 360);
    saturation = boundValue(saturation * 100, 100);
    value = boundValue(value * 100, 100);

    const i = ~~(hue * 6);
    const fVal = (hue * 6) - i;
    const pVal = value * (1 - saturation);
    const qVal = value * (1 - (fVal * saturation));
    const tVal = value * (1 - ((1 - fVal) * saturation));
    let red = 0; let green = 0; let blue = 0;
    switch(i % 6) {
        case 0:
            red = value;
            green = tVal;
            blue = pVal;
            break;
        case 1:
            red = qVal;
            green = value;
            blue = pVal;
            break;
        case 2:
            red = pVal;
            green = value;
            blue = tVal;
            break;
        case 3:
            red = pVal;
            green = qVal;
            blue = value;
            break;
        case 4:
            red = tVal;
            green = pVal;
            blue = value;
            break;
        case 5:
            red = value;
            green = pVal;
            blue = qVal;
            break;
    }

    const round = (value: number): number => Math.round(value * 255);

    return {
        red: round(red),
        green: round(green),
        blue: round(blue),
    };
};

/**
 * r.g.b 转换为 h.s.v
 * @param red
 * @param green
 * @param blue
 * @param alpha
 */
export const rgb2hsv = (red: number, green: number, blue: number, alpha?: number): Hsva => {
    red = boundValue(red, 255);
    green = boundValue(green, 255);
    blue = boundValue(blue, 255);
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const value = max;
    const delta = max - min;
    let hue;
    const saturation = max === 0 ? 0 : delta / max;

    if (max === min) {
        hue = 0;
    } else {
        switch (max) {
            case red:
                hue = ((green - blue) / delta) + (green < blue ? 6 : 0);
                break;
            case green:
                hue = ((blue - red) / delta) + 2;
                break;
            case blue:
                hue = ((red - green) / delta) + 4;
                break;
        }
        hue /= 6;
    }

    return {
        hue: hue * 360,
        saturation,
        value,
        alpha: parseAlpha(alpha),
    };
};


/**
 * hex转换为rgb
 * @param color
 */
export const hex2rgb = (color: string): Rgba => {
    color = color.replace(/^#/, '');
    if (color.length === 3) {
        const colors = [];
        for (let i = 0; i < 3; i++) {
            colors.push(color[i], color[i]);
        }
        color = colors.join('');
    }

    const red = parseInt([color[0], color[1]].join(''), 16);
    const green = parseInt([color[2], color[3]].join(''), 16);
    const blue = parseInt([color[4], color[5]].join(''), 16);

    return {
        red,
        green,
        blue,
    };
};

/**
 * rgb转换为hex
 * @param red
 * @param green
 * @param blue
 */
export const rgb2hex = (red: number, green: number, blue: number): string => {
    const hexR = red.toString(16).padStart(2, '0');
    const hexG = green.toString(16).padStart(2, '0');
    const hexB = blue.toString(16).padStart(2, '0');

    return `#${hexR}${hexG}${hexB}`;
};
