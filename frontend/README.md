# How to run
- __Install [Nodejs](https://nodejs.org/en/download)__
   - Verify install by running these commands
     ```bash
     node -v
     ```
     ```bash
     npm -v
     ```
  - Should look like <img width="480" height="25" alt="image" src="https://github.com/user-attachments/assets/d77435ad-894a-4d4f-beba-682b258fe54b" /><br>
    And <img width="582" height="28" alt="image" src="https://github.com/user-attachments/assets/8ce95599-a3c2-4459-81e5-c638d3a0d75d" />

- __Run React__
   - Open terminal in VSCode (`ctrl` + \` _backtick_)
   - Navigate to the root directory of the frontend
     ```bash
     cd <git repo>/frontend
     ```
   - Install dependencies (first run, or whenever dependencies change)
     ```bash
     npm install
     npm run dev
     ```
   - Open (`ctrl + left mouse button` localhost site)
     <img width="610" height="87" alt="image" src="https://github.com/user-attachments/assets/41445966-e7e2-4166-ad8b-c646a2e6a184" />
  - Expected Result
    <img width="955" height="942" alt="image" src="https://github.com/user-attachments/assets/738893a2-980d-4ee3-9d06-46b7e8aa6145" />
---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
