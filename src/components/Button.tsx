import { styled } from '../types/styled';

export const Button = styled('button', {
  label: 'button',
  base: `px-8 py-2 rounded transform duration-75
  outline-none focus:outline-none
  focus:hover:(scale-105 text-yellow-300) color-white`,

  defaults: {
    variant: 'primary',
    size: 'base',
  },
  props: {
    size: {
      sm: 'text-sm',
      base: 'text-lg',
    },
    variant: {
      primary: `
          bg-black text-white border-black
          focus:(ring-2 ring-yellow-400)
        `,
      secondary: `
          border-2 border-yellow-500 bg-gray-800 text-gray-100
          focus:(ring-2 ring-purple-400)
          // Use short css to combine tailwind classes with regular css
          box-shadow[0 0.1em 0 0 rgba(0, 0, 0, 0.25)]
        `,
    },
  },
});
