// vite.config.ts
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as process from "node:process";
import { loadEnv } from "file:///D:/cg/xz-cloud-platform/node_modules/vite/dist/node/index.js";

// plugins/index.ts
import vue from "file:///D:/cg/xz-cloud-platform/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/cg/xz-cloud-platform/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/cg/xz-cloud-platform/node_modules/unplugin-auto-import/dist/vite.js";
import GenerateConfig from "file:///D:/cg/xz-cloud-platform/node_modules/unplugin-config/dist/vite.js";
import Components from "file:///D:/cg/xz-cloud-platform/node_modules/unplugin-vue-components/dist/vite.js";
import VitePluginPreloadAll from "file:///D:/cg/xz-cloud-platform/node_modules/@mistjs/vite-plugin-preload/dist/index.mjs";
import Unocss from "file:///D:/cg/xz-cloud-platform/node_modules/unocss/dist/vite.mjs";
import AntdvResolver from "file:///D:/cg/xz-cloud-platform/node_modules/antdv-component-resolver/dist/index.mjs";

// plugins/constants.ts
var GLOB_CONFIG_FILE_NAME = "_app.config.js";
var OUTPUT_DIR = "dist";

// plugins/vite-build-info.ts
import { readdir, stat } from "node:fs";
import dayjs from "file:///D:/cg/xz-cloud-platform/node_modules/dayjs/dayjs.min.js";
import duration from "file:///D:/cg/xz-cloud-platform/node_modules/dayjs/plugin/duration.js";
import pkg from "file:///D:/cg/xz-cloud-platform/node_modules/picocolors/picocolors.js";
var { green, blue, bold } = pkg;
dayjs.extend(duration);
var fileListTotal = [];
function recursiveDirectory(folder, callback) {
  readdir(folder, (err, files) => {
    if (err)
      throw err;
    let count = 0;
    const checkEnd = () => {
      ++count === files.length && callback();
    };
    files.forEach((item) => {
      stat(`${folder}/${item}`, async (err2, stats) => {
        if (err2)
          throw err2;
        if (stats.isFile()) {
          fileListTotal.push(stats.size);
          checkEnd();
        } else if (stats.isDirectory()) {
          recursiveDirectory(`${folder}/${item}/`, checkEnd);
        }
      });
    });
    files.length === 0 && callback();
  });
}
function sum(arr) {
  return arr.reduce((t, c) => {
    return t + c;
  }, 0);
}
function formatBytes(a, b) {
  if (a === 0)
    return "0 Bytes";
  const c = 1024;
  const d = b || 2;
  const e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const f = Math.floor(Math.log(a) / Math.log(c));
  return `${Number.parseFloat((a / c ** f).toFixed(d))} ${e[f]}`;
}
function viteBuildInfo(name) {
  let config;
  let startTime;
  let endTime;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      console.log(
        bold(
          green(
            `\u{1F44F}\u6B22\u8FCE\u4F7F\u7528${blue(`[${name}]`)}\uFF0C\u73B0\u5728\u6B63\u5168\u529B\u4E3A\u60A8${config.command === "build" ? "\u6253\u5305" : "\u7F16\u8BD1"}`
          )
        )
      );
      if (config.command === "build")
        startTime = dayjs(/* @__PURE__ */ new Date());
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(/* @__PURE__ */ new Date());
        recursiveDirectory(config.build.outDir, () => {
          console.log(
            bold(
              green(
                `\u606D\u559C\u6253\u5305\u5B8C\u6210\u{1F389}\uFF08\u603B\u7528\u65F6${dayjs.duration(endTime.diff(startTime)).format("mm\u5206ss\u79D2")}\uFF0C\u6253\u5305\u540E\u7684\u5927\u5C0F\u4E3A${formatBytes(
                  sum(fileListTotal)
                )}\uFF09`
              )
            )
          );
        });
      }
    }
  };
}

// plugins/index.ts
function createVitePlugins(env) {
  const vitePluginList = [
    vue(),
    vueJsx(),
    VitePluginPreloadAll(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/core",
        "pinia"
      ],
      dts: "types/auto-imports.d.ts",
      dirs: ["src/stores", "src/composables"]
    }),
    Components({
      resolvers: [AntdvResolver()],
      dts: "types/components.d.ts",
      dirs: ["src/components"]
    }),
    // https://github.com/kirklin/unplugin-config
    GenerateConfig({
      appName: env.VITE_GLOB_APP_TITLE,
      configFile: {
        generate: true,
        fileName: GLOB_CONFIG_FILE_NAME,
        outputDir: OUTPUT_DIR
      },
      envVariables: {
        prefix: "VITE_GLOB_"
      }
    }),
    Unocss(),
    viteBuildInfo(env.VITE_APP_NAME)
  ];
  return vitePluginList;
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/cg/xz-cloud-platform/vite.config.ts";
var baseSrc = fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url));
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const proxyObj = {};
  if (mode === "development" && env.VITE_APP_BASE_API_DEV && env.VITE_APP_BASE_URL_DEV) {
    proxyObj[env.VITE_APP_BASE_API_DEV] = {
      target: env.VITE_APP_BASE_URL_DEV,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API_DEV}`), "")
    };
  }
  return {
    plugins: createVitePlugins(env),
    resolve: {
      alias: [
        {
          find: "dayjs",
          replacement: "dayjs/esm"
        },
        {
          find: /^dayjs\/locale/,
          replacement: "dayjs/esm/locale"
        },
        {
          find: /^dayjs\/plugin/,
          replacement: "dayjs/esm/plugin"
        },
        {
          find: "vue-i18n",
          replacement: mode === "development" ? "vue-i18n/dist/vue-i18n.esm-browser.js" : "vue-i18n/dist/vue-i18n.esm-bundler.js"
        },
        {
          find: /^ant-design-vue\/es$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: /^ant-design-vue\/dist$/,
          replacement: "ant-design-vue/dist"
        },
        {
          find: /^ant-design-vue\/lib$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: /^ant-design-vue$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: "lodash",
          replacement: "lodash-es"
        },
        {
          find: "~@",
          replacement: baseSrc
        },
        {
          find: "~",
          replacement: baseSrc
        },
        {
          find: "@",
          replacement: baseSrc
        },
        {
          find: "~#",
          replacement: resolve(baseSrc, "./enums")
        }
      ]
    },
    build: {
      chunkSizeWarningLimit: 4096,
      outDir: OUTPUT_DIR,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "vue-router", "pinia", "vue-i18n", "@vueuse/core"],
            antd: ["ant-design-vue", "@ant-design/icons-vue", "dayjs"]
            // lodash: ['loadsh-es'],
          }
        }
      }
    },
    server: {
      port: 80,
      proxy: {
        ...proxyObj,
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), "")
        }
      }
    },
    test: {
      globals: true,
      environment: "jsdom"
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy9pbmRleC50cyIsICJwbHVnaW5zL2NvbnN0YW50cy50cyIsICJwbHVnaW5zL3ZpdGUtYnVpbGQtaW5mby50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGNnXFxcXHh6LWNsb3VkLXBsYXRmb3JtXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjZ1xcXFx4ei1jbG91ZC1wbGF0Zm9ybVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY2cveHotY2xvdWQtcGxhdGZvcm0vdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcclxuaW1wb3J0ICogYXMgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXHJcbmltcG9ydCB7IGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdHlwZSB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB7IGNyZWF0ZVZpdGVQbHVnaW5zIH0gZnJvbSAnLi9wbHVnaW5zJ1xyXG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi9wbHVnaW5zL2NvbnN0YW50cydcclxuXHJcbmNvbnN0IGJhc2VTcmMgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXHJcbiAgY29uc3QgcHJveHlPYmogPSB7fVxyXG4gIGlmIChtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmIGVudi5WSVRFX0FQUF9CQVNFX0FQSV9ERVYgJiYgZW52LlZJVEVfQVBQX0JBU0VfVVJMX0RFVikge1xyXG4gICAgcHJveHlPYmpbZW52LlZJVEVfQVBQX0JBU0VfQVBJX0RFVl0gPSB7XHJcbiAgICAgIHRhcmdldDogZW52LlZJVEVfQVBQX0JBU0VfVVJMX0RFVixcclxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtlbnYuVklURV9BUFBfQkFTRV9BUElfREVWfWApLCAnJyksXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zOiBjcmVhdGVWaXRlUGx1Z2lucyhlbnYpLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdkYXlqcycsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2RheWpzL2VzbScsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAvXmRheWpzXFwvbG9jYWxlLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnZGF5anMvZXNtL2xvY2FsZScsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAvXmRheWpzXFwvcGx1Z2luLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnZGF5anMvZXNtL3BsdWdpbicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAndnVlLWkxOG4nLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcgPyAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5lc20tYnJvd3Nlci5qcycgOiAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5lc20tYnVuZGxlci5qcycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAvXmFudC1kZXNpZ24tdnVlXFwvZXMkLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnYW50LWRlc2lnbi12dWUvZXMnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogL15hbnQtZGVzaWduLXZ1ZVxcL2Rpc3QkLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnYW50LWRlc2lnbi12dWUvZGlzdCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAvXmFudC1kZXNpZ24tdnVlXFwvbGliJC8sXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2FudC1kZXNpZ24tdnVlL2VzJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWUkLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnYW50LWRlc2lnbi12dWUvZXMnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ2xvZGFzaCcsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2xvZGFzaC1lcycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAnfkAnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IGJhc2VTcmMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAnficsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogYmFzZVNyYyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdAJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBiYXNlU3JjLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ34jJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlKGJhc2VTcmMsICcuL2VudW1zJyksXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDQwOTYsXHJcbiAgICAgIG91dERpcjogT1VUUFVUX0RJUixcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgIHZ1ZTogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYScsICd2dWUtaTE4bicsICdAdnVldXNlL2NvcmUnXSxcclxuICAgICAgICAgICAgYW50ZDogWydhbnQtZGVzaWduLXZ1ZScsICdAYW50LWRlc2lnbi9pY29ucy12dWUnLCAnZGF5anMnXSxcclxuICAgICAgICAgICAgLy8gbG9kYXNoOiBbJ2xvYWRzaC1lcyddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiA4MCxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAuLi5wcm94eU9iaixcclxuICAgICAgICBbZW52LlZJVEVfQVBQX0JBU0VfQVBJXToge1xyXG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUFBfQkFTRV9VUkwsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtlbnYuVklURV9BUFBfQkFTRV9BUEl9YCksICcnKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHRlc3Q6IHtcclxuICAgICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcbiAgICB9LFxyXG4gIH1cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGNnXFxcXHh6LWNsb3VkLXBsYXRmb3JtXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGNnXFxcXHh6LWNsb3VkLXBsYXRmb3JtXFxcXHBsdWdpbnNcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NnL3h6LWNsb3VkLXBsYXRmb3JtL3BsdWdpbnMvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBHZW5lcmF0ZUNvbmZpZyBmcm9tICd1bnBsdWdpbi1jb25maWcvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IFZpdGVQbHVnaW5QcmVsb2FkQWxsIGZyb20gJ0BtaXN0anMvdml0ZS1wbHVnaW4tcHJlbG9hZCdcclxuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcclxuaW1wb3J0IEFudGR2UmVzb2x2ZXIgZnJvbSAnYW50ZHYtY29tcG9uZW50LXJlc29sdmVyJ1xyXG5pbXBvcnQgeyBHTE9CX0NPTkZJR19GSUxFX05BTUUsIE9VVFBVVF9ESVIgfSBmcm9tICcuL2NvbnN0YW50cydcclxuaW1wb3J0IHsgdml0ZUJ1aWxkSW5mbyB9IGZyb20gJy4vdml0ZS1idWlsZC1pbmZvJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZpdGVQbHVnaW5zKGVudjogUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xyXG4gIGNvbnN0IHZpdGVQbHVnaW5MaXN0OiAoUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10pW10gPSBbXHJcbiAgICB2dWUoKSxcclxuICAgIHZ1ZUpzeCgpLFxyXG4gICAgVml0ZVBsdWdpblByZWxvYWRBbGwoKSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICd2dWUtaTE4bicsXHJcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgJ3BpbmlhJyxcclxuICAgICAgXSxcclxuICAgICAgZHRzOiAndHlwZXMvYXV0by1pbXBvcnRzLmQudHMnLFxyXG4gICAgICBkaXJzOiBbJ3NyYy9zdG9yZXMnLCAnc3JjL2NvbXBvc2FibGVzJ10sXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtBbnRkdlJlc29sdmVyKCldLFxyXG4gICAgICBkdHM6ICd0eXBlcy9jb21wb25lbnRzLmQudHMnLFxyXG4gICAgICBkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sXHJcbiAgICB9KSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9raXJrbGluL3VucGx1Z2luLWNvbmZpZ1xyXG4gICAgR2VuZXJhdGVDb25maWcoe1xyXG4gICAgICBhcHBOYW1lOiBlbnYuVklURV9HTE9CX0FQUF9USVRMRSxcclxuICAgICAgY29uZmlnRmlsZToge1xyXG4gICAgICAgIGdlbmVyYXRlOiB0cnVlLFxyXG4gICAgICAgIGZpbGVOYW1lOiBHTE9CX0NPTkZJR19GSUxFX05BTUUsXHJcbiAgICAgICAgb3V0cHV0RGlyOiBPVVRQVVRfRElSLFxyXG4gICAgICB9LFxyXG4gICAgICBlbnZWYXJpYWJsZXM6IHtcclxuICAgICAgICBwcmVmaXg6ICdWSVRFX0dMT0JfJyxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgVW5vY3NzKCksXHJcbiAgICB2aXRlQnVpbGRJbmZvKGVudi5WSVRFX0FQUF9OQU1FKSxcclxuICBdXHJcbiAgcmV0dXJuIHZpdGVQbHVnaW5MaXN0XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjZ1xcXFx4ei1jbG91ZC1wbGF0Zm9ybVxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjZ1xcXFx4ei1jbG91ZC1wbGF0Zm9ybVxcXFxwbHVnaW5zXFxcXGNvbnN0YW50cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY2cveHotY2xvdWQtcGxhdGZvcm0vcGx1Z2lucy9jb25zdGFudHMudHNcIjsvLyBUaGlzIGNvbnN0YW50IGRlZmluZXMgdGhlIG5hbWUgb2YgdGhlIGNvbmZpZ3VyYXRpb24gZmlsZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiB0aGUgcHJvZHVjdGlvbiBlbnZpcm9ubWVudFxyXG5leHBvcnQgY29uc3QgR0xPQl9DT05GSUdfRklMRV9OQU1FID0gJ19hcHAuY29uZmlnLmpzJ1xyXG5cclxuLy8gVGhpcyBjb25zdGFudCBzZXRzIHRoZSBvdXRwdXQgZGlyZWN0b3J5IGZvciB0aGUgVml0ZSBwYWNrYWdlXHJcbmV4cG9ydCBjb25zdCBPVVRQVVRfRElSID0gJ2Rpc3QnXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcY2dcXFxceHotY2xvdWQtcGxhdGZvcm1cXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY2dcXFxceHotY2xvdWQtcGxhdGZvcm1cXFxccGx1Z2luc1xcXFx2aXRlLWJ1aWxkLWluZm8udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NnL3h6LWNsb3VkLXBsYXRmb3JtL3BsdWdpbnMvdml0ZS1idWlsZC1pbmZvLnRzXCI7aW1wb3J0IHsgcmVhZGRpciwgc3RhdCB9IGZyb20gJ25vZGU6ZnMnXHJcbmltcG9ydCB0eXBlIHsgUGx1Z2luLCBSZXNvbHZlZENvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcclxuaW1wb3J0IHR5cGUgeyBEYXlqcyB9IGZyb20gJ2RheWpzJ1xyXG5pbXBvcnQgZHVyYXRpb24gZnJvbSAnZGF5anMvcGx1Z2luL2R1cmF0aW9uJ1xyXG5pbXBvcnQgcGtnIGZyb20gJ3BpY29jb2xvcnMnXHJcblxyXG5jb25zdCB7IGdyZWVuLCBibHVlLCBib2xkIH0gPSBwa2dcclxuZGF5anMuZXh0ZW5kKGR1cmF0aW9uKVxyXG5cclxuY29uc3QgZmlsZUxpc3RUb3RhbDogbnVtYmVyW10gPSBbXVxyXG5cclxuZnVuY3Rpb24gcmVjdXJzaXZlRGlyZWN0b3J5KGZvbGRlcjogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcclxuICByZWFkZGlyKGZvbGRlciwgKGVyciwgZmlsZXM6IHN0cmluZ1tdKSA9PiB7XHJcbiAgICBpZiAoZXJyKVxyXG4gICAgICB0aHJvdyBlcnJcclxuICAgIGxldCBjb3VudCA9IDBcclxuICAgIGNvbnN0IGNoZWNrRW5kID0gKCkgPT4ge1xyXG4gICAgICArK2NvdW50ID09PSBmaWxlcy5sZW5ndGggJiYgY2FsbGJhY2soKVxyXG4gICAgfVxyXG4gICAgZmlsZXMuZm9yRWFjaCgoaXRlbTogc3RyaW5nKSA9PiB7XHJcbiAgICAgIHN0YXQoYCR7Zm9sZGVyfS8ke2l0ZW19YCwgYXN5bmMgKGVyciwgc3RhdHMpID0+IHtcclxuICAgICAgICBpZiAoZXJyKVxyXG4gICAgICAgICAgdGhyb3cgZXJyXHJcbiAgICAgICAgaWYgKHN0YXRzLmlzRmlsZSgpKSB7XHJcbiAgICAgICAgICBmaWxlTGlzdFRvdGFsLnB1c2goc3RhdHMuc2l6ZSlcclxuICAgICAgICAgIGNoZWNrRW5kKClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xyXG4gICAgICAgICAgcmVjdXJzaXZlRGlyZWN0b3J5KGAke2ZvbGRlcn0vJHtpdGVtfS9gLCBjaGVja0VuZClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gICAgZmlsZXMubGVuZ3RoID09PSAwICYmIGNhbGxiYWNrKClcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdW0oYXJyOiBudW1iZXJbXSkge1xyXG4gIHJldHVybiBhcnIucmVkdWNlKCh0OiBudW1iZXIsIGM6IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIHQgKyBjXHJcbiAgfSwgMClcclxufVxyXG5mdW5jdGlvbiBmb3JtYXRCeXRlcyhhOiBudW1iZXIsIGI/OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gIGlmIChhID09PSAwKVxyXG4gICAgcmV0dXJuICcwIEJ5dGVzJ1xyXG4gIGNvbnN0IGMgPSAxMDI0XHJcbiAgY29uc3QgZCA9IGIgfHwgMlxyXG4gIGNvbnN0IGUgPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJywgJ0VCJywgJ1pCJywgJ1lCJ11cclxuICBjb25zdCBmID0gTWF0aC5mbG9vcihNYXRoLmxvZyhhKSAvIE1hdGgubG9nKGMpKVxyXG4gIHJldHVybiBgJHtOdW1iZXIucGFyc2VGbG9hdCgoYSAvIGMgKiogZikudG9GaXhlZChkKSl9ICR7ZVtmXX1gXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2aXRlQnVpbGRJbmZvKG5hbWU6IHN0cmluZyk6IFBsdWdpbiB7XHJcbiAgbGV0IGNvbmZpZzogUmVzb2x2ZWRDb25maWdcclxuICBsZXQgc3RhcnRUaW1lOiBEYXlqc1xyXG4gIGxldCBlbmRUaW1lOiBEYXlqc1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAndml0ZTpidWlsZEluZm8nLFxyXG4gICAgY29uZmlnUmVzb2x2ZWQocmVzb2x2ZWRDb25maWcpIHtcclxuICAgICAgY29uZmlnID0gcmVzb2x2ZWRDb25maWdcclxuICAgIH0sXHJcbiAgICBidWlsZFN0YXJ0KCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICBib2xkKFxyXG4gICAgICAgICAgZ3JlZW4oXHJcbiAgICAgICAgICAgIGBcdUQ4M0RcdURDNEZcdTZCMjJcdThGQ0VcdTRGN0ZcdTc1Mjgke2JsdWUoYFske25hbWV9XWApfVx1RkYwQ1x1NzNCMFx1NTcyOFx1NkI2M1x1NTE2OFx1NTI5Qlx1NEUzQVx1NjBBOCR7Y29uZmlnLmNvbW1hbmQgPT09ICdidWlsZCcgPyAnXHU2MjUzXHU1MzA1JyA6ICdcdTdGMTZcdThCRDEnXHJcbiAgICAgICAgICAgIH1gLFxyXG4gICAgICAgICAgKSxcclxuICAgICAgICApLFxyXG4gICAgICApXHJcbiAgICAgIGlmIChjb25maWcuY29tbWFuZCA9PT0gJ2J1aWxkJylcclxuICAgICAgICBzdGFydFRpbWUgPSBkYXlqcyhuZXcgRGF0ZSgpKVxyXG4gICAgfSxcclxuICAgIGNsb3NlQnVuZGxlKCkge1xyXG4gICAgICBpZiAoY29uZmlnLmNvbW1hbmQgPT09ICdidWlsZCcpIHtcclxuICAgICAgICBlbmRUaW1lID0gZGF5anMobmV3IERhdGUoKSlcclxuICAgICAgICByZWN1cnNpdmVEaXJlY3RvcnkoY29uZmlnLmJ1aWxkLm91dERpciwgKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgIGJvbGQoXHJcbiAgICAgICAgICAgICAgZ3JlZW4oXHJcbiAgICAgICAgICAgICAgICBgXHU2MDZEXHU1NTlDXHU2MjUzXHU1MzA1XHU1QjhDXHU2MjEwXHVEODNDXHVERjg5XHVGRjA4XHU2MDNCXHU3NTI4XHU2NUY2JHtkYXlqc1xyXG4gICAgICAgICAgICAgICAgICAuZHVyYXRpb24oZW5kVGltZS5kaWZmKHN0YXJ0VGltZSkpXHJcbiAgICAgICAgICAgICAgICAgIC5mb3JtYXQoJ21tXHU1MjA2c3NcdTc5RDInKX1cdUZGMENcdTYyNTNcdTUzMDVcdTU0MEVcdTc2ODRcdTU5MjdcdTVDMEZcdTRFM0Eke2Zvcm1hdEJ5dGVzKFxyXG4gICAgICAgICAgICAgICAgICAgIHN1bShmaWxlTGlzdFRvdGFsKSxcclxuICAgICAgICAgICAgICAgICAgKX1cdUZGMDlgLFxyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsZUFBZTtBQUN4QixTQUFTLHFCQUFxQjtBQUM5QixZQUFZLGFBQWE7QUFDekIsU0FBUyxlQUFlOzs7QUNIeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG9CQUFvQjtBQUMzQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLDBCQUEwQjtBQUNqQyxPQUFPLFlBQVk7QUFDbkIsT0FBTyxtQkFBbUI7OztBQ1BuQixJQUFNLHdCQUF3QjtBQUc5QixJQUFNLGFBQWE7OztBQ0pxUSxTQUFTLFNBQVMsWUFBWTtBQUU3VCxPQUFPLFdBQVc7QUFFbEIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sU0FBUztBQUVoQixJQUFNLEVBQUUsT0FBTyxNQUFNLEtBQUssSUFBSTtBQUM5QixNQUFNLE9BQU8sUUFBUTtBQUVyQixJQUFNLGdCQUEwQixDQUFDO0FBRWpDLFNBQVMsbUJBQW1CLFFBQWdCLFVBQTBCO0FBQ3BFLFVBQVEsUUFBUSxDQUFDLEtBQUssVUFBb0I7QUFDeEMsUUFBSTtBQUNGLFlBQU07QUFDUixRQUFJLFFB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
