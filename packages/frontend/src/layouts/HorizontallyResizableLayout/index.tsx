import { useEffect, useRef } from 'react';

import { Flex, Grid } from '@chakra-ui/react';

import { ResizeBoundaryDivider } from '~/layouts/ResizeBoundaryDivider';

const ASIDE_INITIAL_SIZE = 350;
const ASIDE_MIN_SIZE = 200;
const ASIDE_MAX_SIZE = 500;

const defaultAside = (
  <Grid w="full" h="100vh" placeContent="center" fontSize="4xl" bg="green.100">
    Aside
  </Grid>
);

const defaultMain = (
  <Grid w="full" h="100vh" placeContent="center" fontSize="4xl" bg="purple.100">
    Main
  </Grid>
);

interface Props {
  aside?: JSX.Element;
  main?: JSX.Element;
}

export const HorizontallyResizableLayout = ({ aside = defaultAside, main = defaultMain }: Props): JSX.Element => {
  const isPointerPressedRef = useRef(false);
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 各リスナーはリサイズ中にバーからカーソルがずれても効くようにドキュメント全体に張る
    const pointerUpListener = () => (isPointerPressedRef.current = false);
    document.addEventListener('pointerup', pointerUpListener);

    const pointerMoveListener = (event: PointerEvent) => {
      const x = event.x;

      if (isPointerPressedRef.current && asideRef.current !== null) {
        if (x < ASIDE_MIN_SIZE) {
          asideRef.current.style.width = `${ASIDE_MIN_SIZE}px`;
        } else if (x > ASIDE_MAX_SIZE) {
          asideRef.current.style.width = `${ASIDE_MAX_SIZE}px`;
        } else {
          asideRef.current.style.width = `${x}px`;
        }
      }
    };
    document.addEventListener('pointermove', pointerMoveListener);

    return () => {
      document.removeEventListener('pointerup', pointerUpListener);
      document.removeEventListener('pointermove', pointerMoveListener);
    };
  }, []);

  return (
    <Flex w="100vw" h="100vh">
      <Grid as="aside" ref={asideRef} h="100%" w={`${ASIDE_INITIAL_SIZE}px`}>
        {aside}
      </Grid>
      <ResizeBoundaryDivider onPointerDown={() => (isPointerPressedRef.current = true)} />
      <Grid as="main" h="100%" flex="1 1">
        {main}
      </Grid>
    </Flex>
  );
};
