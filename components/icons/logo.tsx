import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${process.env.SITE_NAME} logo`}
      viewBox="0 0 32 32"
      {...props}
      className={clsx('h-4 w-4 fill-black dark:fill-white', props.className)}
    >
      {/* Water-drop / glow icon */}
      <path d="M16 2C16 2 6 14 6 20a10 10 0 0 0 20 0C26 14 16 2 16 2z" />
    </svg>
  );
}
