import * as React from "react";
import * as Radix from "@radix-ui/react-primitive";
import { Primitive } from "@radix-ui/react-primitive";
type Direction = 'ltr' | 'rtl';
type Sizes = {
    content: number;
    viewport: number;
    scrollbar: {
        size: number;
        paddingStart: number;
        paddingEnd: number;
    };
};
export const createScrollAreaScope: import("@radix-ui/react-context").CreateScope;
type ScrollAreaContextValue = {
    type: 'auto' | 'always' | 'scroll' | 'hover';
    dir: Direction;
    scrollHideDelay: number;
    scrollArea: ScrollAreaElement | null;
    viewport: ScrollAreaViewportElement | null;
    onViewportChange(viewport: ScrollAreaViewportElement | null): void;
    content: HTMLDivElement | null;
    onContentChange(content: HTMLDivElement): void;
    scrollbarX: ScrollAreaScrollbarElement | null;
    onScrollbarXChange(scrollbar: ScrollAreaScrollbarElement | null): void;
    scrollbarXEnabled: boolean;
    onScrollbarXEnabledChange(rendered: boolean): void;
    scrollbarY: ScrollAreaScrollbarElement | null;
    onScrollbarYChange(scrollbar: ScrollAreaScrollbarElement | null): void;
    scrollbarYEnabled: boolean;
    onScrollbarYEnabledChange(rendered: boolean): void;
    onCornerWidthChange(width: number): void;
    onCornerHeightChange(height: number): void;
};
type ScrollAreaElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
export interface ScrollAreaProps extends PrimitiveDivProps {
    type?: ScrollAreaContextValue['type'];
    dir?: ScrollAreaContextValue['dir'];
    scrollHideDelay?: number;
}
export const ScrollArea: React.ForwardRefExoticComponent<ScrollAreaProps & React.RefAttributes<HTMLDivElement>>;
type ScrollAreaViewportElement = React.ElementRef<typeof Primitive.div>;
export interface ScrollAreaViewportProps extends PrimitiveDivProps {
}
export const ScrollAreaViewport: React.ForwardRefExoticComponent<ScrollAreaViewportProps & React.RefAttributes<HTMLDivElement>>;
type ScrollAreaScrollbarElement = ScrollAreaScrollbarVisibleElement;
export interface ScrollAreaScrollbarProps extends ScrollAreaScrollbarVisibleProps {
    forceMount?: true;
}
export const ScrollAreaScrollbar: React.ForwardRefExoticComponent<ScrollAreaScrollbarProps & React.RefAttributes<HTMLDivElement>>;
type ScrollAreaScrollbarVisibleElement = ScrollAreaScrollbarAxisElement;
interface ScrollAreaScrollbarVisibleProps extends Omit<ScrollAreaScrollbarAxisProps, keyof ScrollAreaScrollbarAxisPrivateProps> {
    orientation?: 'horizontal' | 'vertical';
}
type ScrollAreaScrollbarAxisPrivateProps = {
    hasThumb: boolean;
    sizes: Sizes;
    onSizesChange(sizes: Sizes): void;
    onThumbChange(thumb: ScrollAreaThumbElement | null): void;
    onThumbPointerDown(pointerPos: number): void;
    onThumbPointerUp(): void;
    onThumbPositionChange(): void;
    onWheelScroll(scrollPos: number): void;
    onDragScroll(pointerPos: number): void;
};
type ScrollAreaScrollbarAxisElement = ScrollAreaScrollbarImplElement;
interface ScrollAreaScrollbarAxisProps extends Omit<ScrollAreaScrollbarImplProps, keyof ScrollAreaScrollbarImplPrivateProps>, ScrollAreaScrollbarAxisPrivateProps {
}
type ScrollbarContext = {
    hasThumb: boolean;
    scrollbar: ScrollAreaScrollbarElement | null;
    onThumbChange(thumb: ScrollAreaThumbElement | null): void;
    onThumbPointerUp(): void;
    onThumbPointerDown(pointerPos: {
        x: number;
        y: number;
    }): void;
    onThumbPositionChange(): void;
};
type ScrollAreaScrollbarImplElement = React.ElementRef<typeof Primitive.div>;
type ScrollAreaScrollbarImplPrivateProps = {
    sizes: Sizes;
    hasThumb: boolean;
    onThumbChange: ScrollbarContext['onThumbChange'];
    onThumbPointerUp: ScrollbarContext['onThumbPointerUp'];
    onThumbPointerDown: ScrollbarContext['onThumbPointerDown'];
    onThumbPositionChange: ScrollbarContext['onThumbPositionChange'];
    onWheelScroll(event: WheelEvent, maxScrollPos: number): void;
    onDragScroll(pointerPos: {
        x: number;
        y: number;
    }): void;
    onResize(): void;
};
interface ScrollAreaScrollbarImplProps extends Omit<PrimitiveDivProps, keyof ScrollAreaScrollbarImplPrivateProps>, ScrollAreaScrollbarImplPrivateProps {
}
type ScrollAreaThumbElement = ScrollAreaThumbImplElement;
export interface ScrollAreaThumbProps extends ScrollAreaThumbImplProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
export const ScrollAreaThumb: React.ForwardRefExoticComponent<ScrollAreaThumbProps & React.RefAttributes<HTMLDivElement>>;
type ScrollAreaThumbImplElement = React.ElementRef<typeof Primitive.div>;
interface ScrollAreaThumbImplProps extends PrimitiveDivProps {
}
export interface ScrollAreaCornerProps extends ScrollAreaCornerImplProps {
}
export const ScrollAreaCorner: React.ForwardRefExoticComponent<ScrollAreaCornerProps & React.RefAttributes<HTMLDivElement>>;
interface ScrollAreaCornerImplProps extends PrimitiveDivProps {
}
export const Root: React.ForwardRefExoticComponent<ScrollAreaProps & React.RefAttributes<HTMLDivElement>>;
export const Viewport: React.ForwardRefExoticComponent<ScrollAreaViewportProps & React.RefAttributes<HTMLDivElement>>;
export const Scrollbar: React.ForwardRefExoticComponent<ScrollAreaScrollbarProps & React.RefAttributes<HTMLDivElement>>;
export const Thumb: React.ForwardRefExoticComponent<ScrollAreaThumbProps & React.RefAttributes<HTMLDivElement>>;
export const Corner: React.ForwardRefExoticComponent<ScrollAreaCornerProps & React.RefAttributes<HTMLDivElement>>;

//# sourceMappingURL=index.d.ts.map
