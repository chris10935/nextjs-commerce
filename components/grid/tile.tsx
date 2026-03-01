import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  hoverSrc,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
  hoverSrc?: React.ComponentProps<typeof Image>['src'];
} & React.ComponentProps<typeof Image>) {
  const { className, priority, ...imageProps } = props;

  return (
    <div
      className={clsx(
        'group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-rose-400 dark:bg-black',
        {
          'border-2 border-rose-400': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {imageProps.src ? (
        <>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript */}
          <Image
            className={clsx(
              'h-full w-full object-contain',
              {
                'transition duration-300 ease-in-out group-hover:scale-105': isInteractive,
                'opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0':
                  Boolean(hoverSrc)
              },
              className
            )}
            priority={priority}
            {...imageProps}
          />
          {hoverSrc ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
            <Image
              className={clsx(
                'h-full w-full object-contain opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100',
                {
                  'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
                },
                className
              )}
              priority={false}
              {...imageProps}
              src={hoverSrc}
            />
          ) : null}
        </>
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
