import $fnFM9$babelruntimehelpersesmextends from "@babel/runtime/helpers/esm/extends";
import {
  forwardRef as $fnFM9$forwardRef,
  useState as $fnFM9$useState,
  createElement as $fnFM9$createElement,
  useRef as $fnFM9$useRef,
  Fragment as $fnFM9$Fragment,
  useEffect as $fnFM9$useEffect,
  useCallback as $fnFM9$useCallback,
  useReducer as $fnFM9$useReducer,
} from "react";
import { Primitive as $fnFM9$Primitive } from "@radix-ui/react-primitive";
import { Presence as $fnFM9$Presence } from "@radix-ui/react-presence";
import { createContextScope as $fnFM9$createContextScope } from "@radix-ui/react-context";
import { useComposedRefs as $fnFM9$useComposedRefs } from "@radix-ui/react-compose-refs";
import { useCallbackRef as $fnFM9$useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useDirection as $fnFM9$useDirection } from "@radix-ui/react-direction";
import { useLayoutEffect as $fnFM9$useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { clamp as $fnFM9$clamp } from "@radix-ui/number";
import { composeEventHandlers as $fnFM9$composeEventHandlers } from "@radix-ui/primitive";

function $6c2e24571c90391f$export$3e6543de14f8614f(initialState, machine) {
  return $fnFM9$useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState !== null && nextState !== void 0 ? nextState : state;
  }, initialState);
}

/* -------------------------------------------------------------------------------------------------
 * ScrollArea
 * -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$SCROLL_AREA_NAME =
  "ScrollArea";
const [
  $57acba87d6e25586$var$createScrollAreaContext,
  $57acba87d6e25586$export$488468afe3a6f2b1,
] = $fnFM9$createContextScope($57acba87d6e25586$var$SCROLL_AREA_NAME);
const [
  $57acba87d6e25586$var$ScrollAreaProvider,
  $57acba87d6e25586$var$useScrollAreaContext,
] = $57acba87d6e25586$var$createScrollAreaContext(
  $57acba87d6e25586$var$SCROLL_AREA_NAME,
);
const $57acba87d6e25586$export$ccf8d8d7bbf3c2cc =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      type: type = "hover",
      dir: dir,
      scrollHideDelay: scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = $fnFM9$useState(null);
    const [viewport, setViewport] = $fnFM9$useState(null);
    const [content, setContent] = $fnFM9$useState(null);
    const [scrollbarX, setScrollbarX] = $fnFM9$useState(null);
    const [scrollbarY, setScrollbarY] = $fnFM9$useState(null);
    const [cornerWidth, setCornerWidth] = $fnFM9$useState(0);
    const [cornerHeight, setCornerHeight] = $fnFM9$useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = $fnFM9$useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = $fnFM9$useState(false);
    const composedRefs = $fnFM9$useComposedRefs(forwardedRef, (node) =>
      setScrollArea(node),
    );
    const direction = $fnFM9$useDirection(dir);
    return /*#__PURE__*/ $fnFM9$createElement(
      $57acba87d6e25586$var$ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type: type,
        dir: direction,
        scrollHideDelay: scrollHideDelay,
        scrollArea: scrollArea,
        viewport: viewport,
        onViewportChange: setViewport,
        content: content,
        onContentChange: setContent,
        scrollbarX: scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled: scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY: scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled: scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
      },
      /*#__PURE__*/ $fnFM9$createElement(
        $fnFM9$Primitive.div,
        $fnFM9$babelruntimehelpersesmextends(
          {
            dir: direction,
          },
          scrollAreaProps,
          {
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style,
            },
          },
        ),
      ),
    );
  });
/*#__PURE__*/ Object.assign($57acba87d6e25586$export$ccf8d8d7bbf3c2cc, {
  displayName: $57acba87d6e25586$var$SCROLL_AREA_NAME,
});
/* -------------------------------------------------------------------------------------------------
 * ScrollAreaViewport
 * -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$VIEWPORT_NAME =
  "ScrollAreaViewport";
const $57acba87d6e25586$export$a21cbf9f11fca853 =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      children: children,
      ...viewportProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$VIEWPORT_NAME,
      __scopeScrollArea,
    );
    const ref = $fnFM9$useRef(null);
    const composedRefs = $fnFM9$useComposedRefs(
      forwardedRef,
      ref,
      context.onViewportChange,
    );
    return /*#__PURE__*/ $fnFM9$createElement(
      $fnFM9$Fragment,
      null,
      /*#__PURE__*/ $fnFM9$createElement("style", {
        dangerouslySetInnerHTML: {
          __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`,
        },
      }),
      /*#__PURE__*/ $fnFM9$createElement(
        $fnFM9$Primitive.div,
        $fnFM9$babelruntimehelpersesmextends(
          {
            "data-radix-scroll-area-viewport": "",
          },
          viewportProps,
          {
            ref: composedRefs,
            style: {
              /**
               * We don't support `visible` because the intention is to have at least one scrollbar
               * if this component is used and `visible` will behave like `auto` in that case
               * https://developer.mozilla.org/en-US/docs/Web/CSS/overflowed#description
               *
               * We don't handle `auto` because the intention is for the native implementation
               * to be hidden if using this component. We just want to ensure the node is scrollable
               * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
               * the browser from having to work out whether to render native scrollbars or not,
               * we tell it to with the intention of hiding them in CSS.
               */ overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
              overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
              ...props.style,
            },
          },
        ),
        children,
      ),
    );
  });
/*#__PURE__*/ Object.assign($57acba87d6e25586$export$a21cbf9f11fca853, {
  displayName: $57acba87d6e25586$var$VIEWPORT_NAME,
});
/* -------------------------------------------------------------------------------------------------
 * ScrollAreaScrollbar
 * -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$SCROLLBAR_NAME =
  "ScrollAreaScrollbar";
const $57acba87d6e25586$export$2fabd85d0eba3c57 =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const { forceMount: forceMount, ...scrollbarProps } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$SCROLLBAR_NAME,
      props.__scopeScrollArea,
    );
    const {
      onScrollbarXEnabledChange: onScrollbarXEnabledChange,
      onScrollbarYEnabledChange: onScrollbarYEnabledChange,
    } = context;
    const isHorizontal = props.orientation === "horizontal";
    $fnFM9$useEffect(() => {
      isHorizontal
        ? onScrollbarXEnabledChange(true)
        : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal
          ? onScrollbarXEnabledChange(false)
          : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover"
      ? /*#__PURE__*/ $fnFM9$createElement(
          $57acba87d6e25586$var$ScrollAreaScrollbarHover,
          $fnFM9$babelruntimehelpersesmextends({}, scrollbarProps, {
            ref: forwardedRef,
            forceMount: forceMount,
          }),
        )
      : context.type === "scroll"
        ? /*#__PURE__*/ $fnFM9$createElement(
            $57acba87d6e25586$var$ScrollAreaScrollbarScroll,
            $fnFM9$babelruntimehelpersesmextends({}, scrollbarProps, {
              ref: forwardedRef,
              forceMount: forceMount,
            }),
          )
        : context.type === "auto"
          ? /*#__PURE__*/ $fnFM9$createElement(
              $57acba87d6e25586$var$ScrollAreaScrollbarAuto,
              $fnFM9$babelruntimehelpersesmextends({}, scrollbarProps, {
                ref: forwardedRef,
                forceMount: forceMount,
              }),
            )
          : context.type === "always"
            ? /*#__PURE__*/ $fnFM9$createElement(
                $57acba87d6e25586$var$ScrollAreaScrollbarVisible,
                $fnFM9$babelruntimehelpersesmextends({}, scrollbarProps, {
                  ref: forwardedRef,
                }),
              )
            : null;
  });
/*#__PURE__*/ Object.assign($57acba87d6e25586$export$2fabd85d0eba3c57, {
  displayName: $57acba87d6e25586$var$SCROLLBAR_NAME,
});
/* -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$ScrollAreaScrollbarHover =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const { forceMount: forceMount, ...scrollbarProps } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$SCROLLBAR_NAME,
      props.__scopeScrollArea,
    );
    const [visible, setVisible] = $fnFM9$useState(false);
    $fnFM9$useEffect(() => {
      const scrollArea = context.scrollArea;
      let hideTimer = 0;
      if (scrollArea) {
        const handlePointerEnter = () => {
          window.clearTimeout(hideTimer);
          setVisible(true);
        };
        const handlePointerLeave = () => {
          hideTimer = window.setTimeout(
            () => setVisible(false),
            context.scrollHideDelay,
          );
        };
        scrollArea.addEventListener("pointerenter", handlePointerEnter);
        scrollArea.addEventListener("pointerleave", handlePointerLeave);
        return () => {
          window.clearTimeout(hideTimer);
          scrollArea.removeEventListener("pointerenter", handlePointerEnter);
          scrollArea.removeEventListener("pointerleave", handlePointerLeave);
        };
      }
    }, [context.scrollArea, context.scrollHideDelay]);
    return /*#__PURE__*/ $fnFM9$createElement(
      $fnFM9$Presence,
      {
        present: forceMount || visible,
      },
      /*#__PURE__*/ $fnFM9$createElement(
        $57acba87d6e25586$var$ScrollAreaScrollbarAuto,
        $fnFM9$babelruntimehelpersesmextends(
          {
            "data-state": visible ? "visible" : "hidden",
          },
          scrollbarProps,
          {
            ref: forwardedRef,
          },
        ),
      ),
    );
  });
const $57acba87d6e25586$var$ScrollAreaScrollbarScroll =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const { forceMount: forceMount, ...scrollbarProps } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$SCROLLBAR_NAME,
      props.__scopeScrollArea,
    );
    const isHorizontal = props.orientation === "horizontal";
    const debounceScrollEnd = $57acba87d6e25586$var$useDebounceCallback(
      () => send("SCROLL_END"),
      100,
    );
    const [state, send] = $6c2e24571c90391f$export$3e6543de14f8614f("hidden", {
      hidden: {
        SCROLL: "scrolling",
      },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting",
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle",
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting",
      },
    });
    $fnFM9$useEffect(() => {
      if (state === "idle") {
        const hideTimer = window.setTimeout(
          () => send("HIDE"),
          context.scrollHideDelay,
        );
        return () => window.clearTimeout(hideTimer);
      }
    }, [state, context.scrollHideDelay, send]);
    $fnFM9$useEffect(() => {
      const viewport = context.viewport;
      const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
      if (viewport) {
        let prevScrollPos = viewport[scrollDirection];
        const handleScroll = () => {
          const scrollPos = viewport[scrollDirection];
          const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
          if (hasScrollInDirectionChanged) {
            send("SCROLL");
            debounceScrollEnd();
          }
          prevScrollPos = scrollPos;
        };
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
    return /*#__PURE__*/ $fnFM9$createElement(
      $fnFM9$Presence,
      {
        present: forceMount || state !== "hidden",
      },
      /*#__PURE__*/ $fnFM9$createElement(
        $57acba87d6e25586$var$ScrollAreaScrollbarVisible,
        $fnFM9$babelruntimehelpersesmextends(
          {
            "data-state": state === "hidden" ? "hidden" : "visible",
          },
          scrollbarProps,
          {
            ref: forwardedRef,
            onPointerEnter: $fnFM9$composeEventHandlers(
              props.onPointerEnter,
              () => send("POINTER_ENTER"),
            ),
            onPointerLeave: $fnFM9$composeEventHandlers(
              props.onPointerLeave,
              () => send("POINTER_LEAVE"),
            ),
          },
        ),
      ),
    );
  });
const $57acba87d6e25586$var$ScrollAreaScrollbarAuto =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$SCROLLBAR_NAME,
      props.__scopeScrollArea,
    );
    const { forceMount: forceMount, ...scrollbarProps } = props;
    const [visible, setVisible] = $fnFM9$useState(false);
    const isHorizontal = props.orientation === "horizontal";
    const handleResize = $57acba87d6e25586$var$useDebounceCallback(() => {
      if (context.viewport) {
        const isOverflowX =
          context.viewport.offsetWidth < context.viewport.scrollWidth;
        const isOverflowY =
          context.viewport.offsetHeight < context.viewport.scrollHeight;
        setVisible(isHorizontal ? isOverflowX : isOverflowY);
      }
    }, 10);
    $57acba87d6e25586$var$useResizeObserver(context.viewport, handleResize);
    $57acba87d6e25586$var$useResizeObserver(context.content, handleResize);
    return /*#__PURE__*/ $fnFM9$createElement(
      $fnFM9$Presence,
      {
        present: forceMount || visible,
      },
      /*#__PURE__*/ $fnFM9$createElement(
        $57acba87d6e25586$var$ScrollAreaScrollbarVisible,
        $fnFM9$babelruntimehelpersesmextends(
          {
            "data-state": visible ? "visible" : "hidden",
          },
          scrollbarProps,
          {
            ref: forwardedRef,
          },
        ),
      ),
    );
  });
/* -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$ScrollAreaScrollbarVisible =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const { orientation: orientation = "vertical", ...scrollbarProps } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$SCROLLBAR_NAME,
      props.__scopeScrollArea,
    );
    const thumbRef = $fnFM9$useRef(null);
    const pointerOffsetRef = $fnFM9$useRef(0);
    const [sizes, setSizes] = $fnFM9$useState({
      content: 0,
      viewport: 0,
      scrollbar: {
        size: 0,
        paddingStart: 0,
        paddingEnd: 0,
      },
    });
    const thumbRatio = $57acba87d6e25586$var$getThumbRatio(
      sizes.viewport,
      sizes.content,
    );
    const commonProps = {
      ...scrollbarProps,
      sizes: sizes,
      onSizesChange: setSizes,
      hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
      onThumbChange: (thumb) => (thumbRef.current = thumb),
      onThumbPointerUp: () => (pointerOffsetRef.current = 0),
      onThumbPointerDown: (pointerPos) =>
        (pointerOffsetRef.current = pointerPos),
    };
    function getScrollPosition(pointerPos, dir) {
      return $57acba87d6e25586$var$getScrollPositionFromPointer(
        pointerPos,
        pointerOffsetRef.current,
        sizes,
        dir,
      );
    }
    if (orientation === "horizontal")
      return /*#__PURE__*/ $fnFM9$createElement(
        $57acba87d6e25586$var$ScrollAreaScrollbarX,
        $fnFM9$babelruntimehelpersesmextends({}, commonProps, {
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollLeft;
              const offset = $57acba87d6e25586$var$getThumbOffsetFromScroll(
                scrollPos,
                sizes,
                context.dir,
              );
              thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) context.viewport.scrollLeft = scrollPos;
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport)
              context.viewport.scrollLeft = getScrollPosition(
                pointerPos,
                context.dir,
              );
          },
        }),
      );
    if (orientation === "vertical")
      return /*#__PURE__*/ $fnFM9$createElement(
        $57acba87d6e25586$var$ScrollAreaScrollbarY,
        $fnFM9$babelruntimehelpersesmextends({}, commonProps, {
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollTop;
              const offset = $57acba87d6e25586$var$getThumbOffsetFromScroll(
                scrollPos,
                sizes,
              );
              thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) context.viewport.scrollTop = scrollPos;
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport)
              context.viewport.scrollTop = getScrollPosition(pointerPos);
          },
        }),
      );
    return null;
  });
/* -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$ScrollAreaScrollbarX =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const {
      sizes: sizes,
      onSizesChange: onSizesChange,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$SCROLLBAR_NAME,
      props.__scopeScrollArea,
    );
    const [computedStyle, setComputedStyle] = $fnFM9$useState();
    const ref = $fnFM9$useRef(null);
    const composeRefs = $fnFM9$useComposedRefs(
      forwardedRef,
      ref,
      context.onScrollbarXChange,
    );
    $fnFM9$useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return /*#__PURE__*/ $fnFM9$createElement(
      $57acba87d6e25586$var$ScrollAreaScrollbarImpl,
      $fnFM9$babelruntimehelpersesmextends(
        {
          "data-orientation": "horizontal",
        },
        scrollbarProps,
        {
          ref: composeRefs,
          sizes: sizes,
          style: {
            bottom: 0,
            left:
              context.dir === "rtl"
                ? "var(--radix-scroll-area-corner-width)"
                : 0,
            right:
              context.dir === "ltr"
                ? "var(--radix-scroll-area-corner-width)"
                : 0,
            ["--radix-scroll-area-thumb-width"]:
              $57acba87d6e25586$var$getThumbSize(sizes) + "px",
            ...props.style,
          },
          onThumbPointerDown: (pointerPos) =>
            props.onThumbPointerDown(pointerPos.x),
          onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
          onWheelScroll: (event, maxScrollPos) => {
            if (context.viewport) {
              const scrollPos = context.viewport.scrollLeft + event.deltaX;
              props.onWheelScroll(scrollPos); // prevent window scroll when wheeling on scrollbar
              if (
                $57acba87d6e25586$var$isScrollingWithinScrollbarBounds(
                  scrollPos,
                  maxScrollPos,
                )
              )
                event.preventDefault();
            }
          },
          onResize: () => {
            if (ref.current && context.viewport && computedStyle)
              onSizesChange({
                content: context.viewport.scrollWidth,
                viewport: context.viewport.offsetWidth,
                scrollbar: {
                  size: ref.current.clientWidth,
                  paddingStart: $57acba87d6e25586$var$toInt(
                    computedStyle.paddingLeft,
                  ),
                  paddingEnd: $57acba87d6e25586$var$toInt(
                    computedStyle.paddingRight,
                  ),
                },
              });
          },
        },
      ),
    );
  });
const $57acba87d6e25586$var$ScrollAreaScrollbarY =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const {
      sizes: sizes,
      onSizesChange: onSizesChange,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$SCROLLBAR_NAME,
      props.__scopeScrollArea,
    );
    const [computedStyle, setComputedStyle] = $fnFM9$useState();
    const ref = $fnFM9$useRef(null);
    const composeRefs = $fnFM9$useComposedRefs(
      forwardedRef,
      ref,
      context.onScrollbarYChange,
    );
    $fnFM9$useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return /*#__PURE__*/ $fnFM9$createElement(
      $57acba87d6e25586$var$ScrollAreaScrollbarImpl,
      $fnFM9$babelruntimehelpersesmextends(
        {
          "data-orientation": "vertical",
        },
        scrollbarProps,
        {
          ref: composeRefs,
          sizes: sizes,
          style: {
            top: 0,
            right: context.dir === "ltr" ? 0 : undefined,
            left: context.dir === "rtl" ? 0 : undefined,
            bottom: "var(--radix-scroll-area-corner-height)",
            ["--radix-scroll-area-thumb-height"]:
              $57acba87d6e25586$var$getThumbSize(sizes) + "px",
            ...props.style,
          },
          onThumbPointerDown: (pointerPos) =>
            props.onThumbPointerDown(pointerPos.y),
          onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
          onWheelScroll: (event, maxScrollPos) => {
            if (context.viewport) {
              const scrollPos = context.viewport.scrollTop + event.deltaY;
              props.onWheelScroll(scrollPos); // prevent window scroll when wheeling on scrollbar
              if (
                $57acba87d6e25586$var$isScrollingWithinScrollbarBounds(
                  scrollPos,
                  maxScrollPos,
                )
              )
                event.preventDefault();
            }
          },
          onResize: () => {
            if (ref.current && context.viewport && computedStyle)
              onSizesChange({
                content: context.viewport.scrollHeight,
                viewport: context.viewport.offsetHeight,
                scrollbar: {
                  size: ref.current.clientHeight,
                  paddingStart: $57acba87d6e25586$var$toInt(
                    computedStyle.paddingTop,
                  ),
                  paddingEnd: $57acba87d6e25586$var$toInt(
                    computedStyle.paddingBottom,
                  ),
                },
              });
          },
        },
      ),
    );
  });
/* -----------------------------------------------------------------------------------------------*/ const [
  $57acba87d6e25586$var$ScrollbarProvider,
  $57acba87d6e25586$var$useScrollbarContext,
] = $57acba87d6e25586$var$createScrollAreaContext(
  $57acba87d6e25586$var$SCROLLBAR_NAME,
);
const $57acba87d6e25586$var$ScrollAreaScrollbarImpl =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      sizes: sizes,
      hasThumb: hasThumb,
      onThumbChange: onThumbChange,
      onThumbPointerUp: onThumbPointerUp,
      onThumbPointerDown: onThumbPointerDown,
      onThumbPositionChange: onThumbPositionChange,
      onDragScroll: onDragScroll,
      onWheelScroll: onWheelScroll,
      onResize: onResize,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$SCROLLBAR_NAME,
      __scopeScrollArea,
    );
    const [scrollbar, setScrollbar] = $fnFM9$useState(null);
    const composeRefs = $fnFM9$useComposedRefs(forwardedRef, (node) =>
      setScrollbar(node),
    );
    const rectRef = $fnFM9$useRef(null);
    const prevWebkitUserSelectRef = $fnFM9$useRef("");
    const viewport = context.viewport;
    const maxScrollPos = sizes.content - sizes.viewport;
    const handleWheelScroll = $fnFM9$useCallbackRef(onWheelScroll);
    const handleThumbPositionChange = $fnFM9$useCallbackRef(
      onThumbPositionChange,
    );
    const handleResize = $57acba87d6e25586$var$useDebounceCallback(
      onResize,
      10,
    );
    function handleDragScroll(event) {
      if (rectRef.current) {
        const x = event.clientX - rectRef.current.left;
        const y = event.clientY - rectRef.current.top;
        onDragScroll({
          x: x,
          y: y,
        });
      }
    }
    /**
     * We bind wheel event imperatively so we can switch off passive
     * mode for document wheel event to allow it to be prevented
     */ $fnFM9$useEffect(() => {
      const handleWheel = (event) => {
        const element = event.target;
        const isScrollbarWheel =
          scrollbar === null || scrollbar === void 0
            ? void 0
            : scrollbar.contains(element);
        if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
      };
      document.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      return () =>
        document.removeEventListener("wheel", handleWheel, {
          passive: false,
        });
    }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
    /**
     * Update thumb position on sizes change
     */ $fnFM9$useEffect(handleThumbPositionChange, [
      sizes,
      handleThumbPositionChange,
    ]);
    $57acba87d6e25586$var$useResizeObserver(scrollbar, handleResize);
    $57acba87d6e25586$var$useResizeObserver(context.content, handleResize);
    return /*#__PURE__*/ $fnFM9$createElement(
      $57acba87d6e25586$var$ScrollbarProvider,
      {
        scope: __scopeScrollArea,
        scrollbar: scrollbar,
        hasThumb: hasThumb,
        onThumbChange: $fnFM9$useCallbackRef(onThumbChange),
        onThumbPointerUp: $fnFM9$useCallbackRef(onThumbPointerUp),
        onThumbPositionChange: handleThumbPositionChange,
        onThumbPointerDown: $fnFM9$useCallbackRef(onThumbPointerDown),
      },
      /*#__PURE__*/ $fnFM9$createElement(
        $fnFM9$Primitive.div,
        $fnFM9$babelruntimehelpersesmextends({}, scrollbarProps, {
          ref: composeRefs,
          style: {
            position: "absolute",
            ...scrollbarProps.style,
          },
          onPointerDown: $fnFM9$composeEventHandlers(
            props.onPointerDown,
            (event) => {
              const mainPointer = 0;
              if (event.button === mainPointer) {
                const element = event.target;
                element.setPointerCapture(event.pointerId);
                rectRef.current = scrollbar.getBoundingClientRect(); // pointer capture doesn't prevent text selection in Safari
                // so we remove text selection manually when scrolling
                prevWebkitUserSelectRef.current =
                  document.body.style.webkitUserSelect;
                document.body.style.webkitUserSelect = "none";
                if (context.viewport)
                  context.viewport.style.scrollBehavior = "auto";
                handleDragScroll(event);
              }
            },
          ),
          onPointerMove: $fnFM9$composeEventHandlers(
            props.onPointerMove,
            handleDragScroll,
          ),
          onPointerUp: $fnFM9$composeEventHandlers(
            props.onPointerUp,
            (event) => {
              const element = event.target;
              if (element.hasPointerCapture(event.pointerId))
                element.releasePointerCapture(event.pointerId);
              document.body.style.webkitUserSelect =
                prevWebkitUserSelectRef.current;
              if (context.viewport) context.viewport.style.scrollBehavior = "";
              rectRef.current = null;
            },
          ),
        }),
      ),
    );
  });
/* -------------------------------------------------------------------------------------------------
 * ScrollAreaThumb
 * -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$THUMB_NAME =
  "ScrollAreaThumb";
const $57acba87d6e25586$export$9fba1154677d7cd2 =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const { forceMount: forceMount, ...thumbProps } = props;
    const scrollbarContext = $57acba87d6e25586$var$useScrollbarContext(
      $57acba87d6e25586$var$THUMB_NAME,
      props.__scopeScrollArea,
    );
    return /*#__PURE__*/ $fnFM9$createElement(
      $fnFM9$Presence,
      {
        present: forceMount || scrollbarContext.hasThumb,
      },
      /*#__PURE__*/ $fnFM9$createElement(
        $57acba87d6e25586$var$ScrollAreaThumbImpl,
        $fnFM9$babelruntimehelpersesmextends(
          {
            ref: forwardedRef,
          },
          thumbProps,
        ),
      ),
    );
  });
const $57acba87d6e25586$var$ScrollAreaThumbImpl =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      style: style,
      ...thumbProps
    } = props;
    const scrollAreaContext = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$THUMB_NAME,
      __scopeScrollArea,
    );
    const scrollbarContext = $57acba87d6e25586$var$useScrollbarContext(
      $57acba87d6e25586$var$THUMB_NAME,
      __scopeScrollArea,
    );
    const { onThumbPositionChange: onThumbPositionChange } = scrollbarContext;
    const composedRef = $fnFM9$useComposedRefs(forwardedRef, (node) =>
      scrollbarContext.onThumbChange(node),
    );
    const removeUnlinkedScrollListenerRef = $fnFM9$useRef();
    const debounceScrollEnd = $57acba87d6e25586$var$useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = undefined;
      }
    }, 100);
    $fnFM9$useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        /**
         * We only bind to native scroll event so we know when scroll starts and ends.
         * When scroll starts we start a requestAnimationFrame loop that checks for
         * changes to scroll position. That rAF loop triggers our thumb position change
         * when relevant to avoid scroll-linked effects. We cancel the loop when scroll ends.
         * https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects
         */ const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = $57acba87d6e25586$var$addUnlinkedScrollListener(
              viewport,
              onThumbPositionChange,
            );
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /*#__PURE__*/ $fnFM9$createElement(
      $fnFM9$Primitive.div,
      $fnFM9$babelruntimehelpersesmextends(
        {
          "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        },
        thumbProps,
        {
          ref: composedRef,
          style: {
            width: "var(--radix-scroll-area-thumb-width)",
            height: "var(--radix-scroll-area-thumb-height)",
            ...style,
          },
          onPointerDownCapture: $fnFM9$composeEventHandlers(
            props.onPointerDownCapture,
            (event) => {
              const thumb = event.target;
              const thumbRect = thumb.getBoundingClientRect();
              const x = event.clientX - thumbRect.left;
              const y = event.clientY - thumbRect.top;
              scrollbarContext.onThumbPointerDown({
                x: x,
                y: y,
              });
            },
          ),
          onPointerUp: $fnFM9$composeEventHandlers(
            props.onPointerUp,
            scrollbarContext.onThumbPointerUp,
          ),
        },
      ),
    );
  });
/*#__PURE__*/ Object.assign($57acba87d6e25586$export$9fba1154677d7cd2, {
  displayName: $57acba87d6e25586$var$THUMB_NAME,
});
/* -------------------------------------------------------------------------------------------------
 * ScrollAreaCorner
 * -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$CORNER_NAME =
  "ScrollAreaCorner";
const $57acba87d6e25586$export$56969d565df7cc4b =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$CORNER_NAME,
      props.__scopeScrollArea,
    );
    const hasBothScrollbarsVisible = Boolean(
      context.scrollbarX && context.scrollbarY,
    );
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner
      ? /*#__PURE__*/ $fnFM9$createElement(
          $57acba87d6e25586$var$ScrollAreaCornerImpl,
          $fnFM9$babelruntimehelpersesmextends({}, props, {
            ref: forwardedRef,
          }),
        )
      : null;
  });
/*#__PURE__*/ Object.assign($57acba87d6e25586$export$56969d565df7cc4b, {
  displayName: $57acba87d6e25586$var$CORNER_NAME,
});
/* -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$var$ScrollAreaCornerImpl =
  /*#__PURE__*/ $fnFM9$forwardRef((props, forwardedRef) => {
    const { __scopeScrollArea: __scopeScrollArea, ...cornerProps } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext(
      $57acba87d6e25586$var$CORNER_NAME,
      __scopeScrollArea,
    );
    const [width1, setWidth] = $fnFM9$useState(0);
    const [height1, setHeight] = $fnFM9$useState(0);
    const hasSize = Boolean(width1 && height1);
    $57acba87d6e25586$var$useResizeObserver(context.scrollbarX, () => {
      var _context$scrollbarX;
      const height =
        ((_context$scrollbarX = context.scrollbarX) === null ||
        _context$scrollbarX === void 0
          ? void 0
          : _context$scrollbarX.offsetHeight) || 0;
      context.onCornerHeightChange(height);
      setHeight(height);
    });
    $57acba87d6e25586$var$useResizeObserver(context.scrollbarY, () => {
      var _context$scrollbarY;
      const width =
        ((_context$scrollbarY = context.scrollbarY) === null ||
        _context$scrollbarY === void 0
          ? void 0
          : _context$scrollbarY.offsetWidth) || 0;
      context.onCornerWidthChange(width);
      setWidth(width);
    });
    return hasSize
      ? /*#__PURE__*/ $fnFM9$createElement(
          $fnFM9$Primitive.div,
          $fnFM9$babelruntimehelpersesmextends({}, cornerProps, {
            ref: forwardedRef,
            style: {
              width: width1,
              height: height1,
              position: "absolute",
              right: context.dir === "ltr" ? 0 : undefined,
              left: context.dir === "rtl" ? 0 : undefined,
              bottom: 0,
              ...props.style,
            },
          }),
        )
      : null;
  });
/* -----------------------------------------------------------------------------------------------*/ function $57acba87d6e25586$var$toInt(
  value,
) {
  return value ? parseInt(value, 10) : 0;
}
function $57acba87d6e25586$var$getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function $57acba87d6e25586$var$getThumbSize(sizes) {
  const ratio = $57acba87d6e25586$var$getThumbRatio(
    sizes.viewport,
    sizes.content,
  );
  const scrollbarPadding =
    sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio; // minimum of 18 matches macOS minimum
  return Math.max(thumbSize, 18);
}
function $57acba87d6e25586$var$getScrollPositionFromPointer(
  pointerPos,
  pointerOffset,
  sizes,
  dir = "ltr",
) {
  const thumbSizePx = $57acba87d6e25586$var$getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos =
    sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange =
    dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = $57acba87d6e25586$var$linearScale(
    [minPointerPos, maxPointerPos],
    scrollRange,
  );
  return interpolate(pointerPos);
}
function $57acba87d6e25586$var$getThumbOffsetFromScroll(
  scrollPos,
  sizes,
  dir = "ltr",
) {
  const thumbSizePx = $57acba87d6e25586$var$getThumbSize(sizes);
  const scrollbarPadding =
    sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange =
    dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = $fnFM9$clamp(scrollPos, scrollClampRange);
  const interpolate = $57acba87d6e25586$var$linearScale(
    [0, maxScrollPos],
    [0, maxThumbPos],
  );
  return interpolate(scrollWithoutMomentum);
} // https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
function $57acba87d6e25586$var$linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function $57acba87d6e25586$var$isScrollingWithinScrollbarBounds(
  scrollPos,
  maxScrollPos,
) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
} // Custom scroll handler to avoid scroll-linked effects
// https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects
const $57acba87d6e25586$var$addUnlinkedScrollListener = (
  node,
  handler = () => {},
) => {
  let prevPosition = {
    left: node.scrollLeft,
    top: node.scrollTop,
  };
  let rAF = 0;
  (function loop() {
    const position = {
      left: node.scrollLeft,
      top: node.scrollTop,
    };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function $57acba87d6e25586$var$useDebounceCallback(callback, delay) {
  const handleCallback = $fnFM9$useCallbackRef(callback);
  const debounceTimerRef = $fnFM9$useRef(0);
  $fnFM9$useEffect(
    () => () => window.clearTimeout(debounceTimerRef.current),
    [],
  );
  return $fnFM9$useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function $57acba87d6e25586$var$useResizeObserver(element, onResize) {
  const handleResize = $fnFM9$useCallbackRef(onResize);
  $fnFM9$useLayoutEffect(() => {
    let rAF = 0;
    if (element) {
      /**
       * Resize Observer will throw an often benign error that says `ResizeObserver loop
       * completed with undelivered notifications`. This means that ResizeObserver was not
       * able to deliver all observations within a single animation frame, so we use
       * `requestAnimationFrame` to ensure we don't deliver unnecessary observations.
       * Further reading: https://github.com/WICG/resize-observer/issues/38
       */ const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
/* -----------------------------------------------------------------------------------------------*/ const $57acba87d6e25586$export$be92b6f5f03c0fe9 =
  $57acba87d6e25586$export$ccf8d8d7bbf3c2cc;
const $57acba87d6e25586$export$d5c6c08dc2d3ca7 =
  $57acba87d6e25586$export$a21cbf9f11fca853;
const $57acba87d6e25586$export$9a4e88b92edfce6b =
  $57acba87d6e25586$export$2fabd85d0eba3c57;
const $57acba87d6e25586$export$6521433ed15a34db =
  $57acba87d6e25586$export$9fba1154677d7cd2;
const $57acba87d6e25586$export$ac61190d9fc311a9 =
  $57acba87d6e25586$export$56969d565df7cc4b;

export {
  $57acba87d6e25586$export$488468afe3a6f2b1 as createScrollAreaScope,
  $57acba87d6e25586$export$ccf8d8d7bbf3c2cc as ScrollArea,
  $57acba87d6e25586$export$a21cbf9f11fca853 as ScrollAreaViewport,
  $57acba87d6e25586$export$2fabd85d0eba3c57 as ScrollAreaScrollbar,
  $57acba87d6e25586$export$9fba1154677d7cd2 as ScrollAreaThumb,
  $57acba87d6e25586$export$56969d565df7cc4b as ScrollAreaCorner,
  $57acba87d6e25586$export$be92b6f5f03c0fe9 as Root,
  $57acba87d6e25586$export$d5c6c08dc2d3ca7 as Viewport,
  $57acba87d6e25586$export$9a4e88b92edfce6b as Scrollbar,
  $57acba87d6e25586$export$6521433ed15a34db as Thumb,
  $57acba87d6e25586$export$ac61190d9fc311a9 as Corner,
};
//# sourceMappingURL=index.mjs.map
