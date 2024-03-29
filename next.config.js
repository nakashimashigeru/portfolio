/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  env: {
    apiKey: "AIzaSyB3P1ANq7Ukl3woyc3eWXrXINcVhNnIys8",
    authDomain: "project-7508986809828098372.firebaseapp.com",
    projectId: "project-7508986809828098372",
    storageBucket: "project-7508986809828098372.appspot.com",
    messagingSenderId: "304501196966",
    appId: "1:304501196966:web:dd5e3129177395a2730c67"
  },
}

module.exports = nextConfig
