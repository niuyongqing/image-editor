// vite.config.ts
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as process from "node:process";
import { loadEnv } from "file:///D:/XZKJ/xz-cloud-platform/node_modules/vite/dist/node/index.js";

// plugins/index.ts
import vue from "file:///D:/XZKJ/xz-cloud-platform/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/XZKJ/xz-cloud-platform/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/XZKJ/xz-cloud-platform/node_modules/unplugin-auto-import/dist/vite.js";
import GenerateConfig from "file:///D:/XZKJ/xz-cloud-platform/node_modules/unplugin-config/dist/vite.js";
import Components from "file:///D:/XZKJ/xz-cloud-platform/node_modules/unplugin-vue-components/dist/vite.js";
import VitePluginPreloadAll from "file:///D:/XZKJ/xz-cloud-platform/node_modules/@mistjs/vite-plugin-preload/dist/index.mjs";
import Unocss from "file:///D:/XZKJ/xz-cloud-platform/node_modules/unocss/dist/vite.mjs";
import AntdvResolver from "file:///D:/XZKJ/xz-cloud-platform/node_modules/antdv-component-resolver/dist/index.mjs";

// plugins/constants.ts
var GLOB_CONFIG_FILE_NAME = "platform/_app.config.js";
var OUTPUT_DIR = "platform";

// plugins/vite-build-info.ts
import { readdir, stat } from "node:fs";
import dayjs from "file:///D:/XZKJ/xz-cloud-platform/node_modules/dayjs/dayjs.min.js";
import duration from "file:///D:/XZKJ/xz-cloud-platform/node_modules/dayjs/plugin/duration.js";
import pkg from "file:///D:/XZKJ/xz-cloud-platform/node_modules/picocolors/picocolors.js";
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
var __vite_injected_original_import_meta_url = "file:///D:/XZKJ/xz-cloud-platform/vite.config.ts";
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
    base: "/platform/",
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
      port: 180,
      open: true,
      proxy: {
        ...proxyObj,
        [env.VITE_APP_BASE_API]: {
          target: `http://10.93.90.37:80`,
          // target: env.VITE_APP_BASE_URL,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy9pbmRleC50cyIsICJwbHVnaW5zL2NvbnN0YW50cy50cyIsICJwbHVnaW5zL3ZpdGUtYnVpbGQtaW5mby50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFhaS0pcXFxceHotY2xvdWQtcGxhdGZvcm1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFhaS0pcXFxceHotY2xvdWQtcGxhdGZvcm1cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1haS0oveHotY2xvdWQtcGxhdGZvcm0vdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwibm9kZTpwYXRoXCI7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcclxuaW1wb3J0ICogYXMgcHJvY2VzcyBmcm9tIFwibm9kZTpwcm9jZXNzXCI7XHJcbmltcG9ydCB7IGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdHlwZSB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVZpdGVQbHVnaW5zIH0gZnJvbSBcIi4vcGx1Z2luc1wiO1xyXG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSBcIi4vcGx1Z2lucy9jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IGJhc2VTcmMgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKTtcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpO1xyXG4gIGNvbnN0IHByb3h5T2JqID0ge307XHJcbiAgaWYgKFxyXG4gICAgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmXHJcbiAgICBlbnYuVklURV9BUFBfQkFTRV9BUElfREVWICYmXHJcbiAgICBlbnYuVklURV9BUFBfQkFTRV9VUkxfREVWXHJcbiAgKSB7XHJcbiAgICBwcm94eU9ialtlbnYuVklURV9BUFBfQkFTRV9BUElfREVWXSA9IHtcclxuICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUFBfQkFTRV9VUkxfREVWLFxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxyXG4gICAgICAgIHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtlbnYuVklURV9BUFBfQkFTRV9BUElfREVWfWApLCBcIlwiKSxcclxuICAgIH07XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBiYXNlOiBcIi9wbGF0Zm9ybS9cIixcclxuICAgIHBsdWdpbnM6IGNyZWF0ZVZpdGVQbHVnaW5zKGVudiksXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogXCJkYXlqc1wiLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IFwiZGF5anMvZXNtXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAvXmRheWpzXFwvbG9jYWxlLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBcImRheWpzL2VzbS9sb2NhbGVcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6IC9eZGF5anNcXC9wbHVnaW4vLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IFwiZGF5anMvZXNtL3BsdWdpblwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogXCJ2dWUtaTE4blwiLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6XHJcbiAgICAgICAgICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIlxyXG4gICAgICAgICAgICAgID8gXCJ2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmVzbS1icm93c2VyLmpzXCJcclxuICAgICAgICAgICAgICA6IFwidnVlLWkxOG4vZGlzdC92dWUtaTE4bi5lc20tYnVuZGxlci5qc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogL15hbnQtZGVzaWduLXZ1ZVxcL2VzJC8sXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogXCJhbnQtZGVzaWduLXZ1ZS9lc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogL15hbnQtZGVzaWduLXZ1ZVxcL2Rpc3QkLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBcImFudC1kZXNpZ24tdnVlL2Rpc3RcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWVcXC9saWIkLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBcImFudC1kZXNpZ24tdnVlL2VzXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAvXmFudC1kZXNpZ24tdnVlJC8sXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogXCJhbnQtZGVzaWduLXZ1ZS9lc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogXCJsb2Rhc2hcIixcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBcImxvZGFzaC1lc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogXCJ+QFwiLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IGJhc2VTcmMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiBcIn5cIixcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBiYXNlU3JjLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogXCJAXCIsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogYmFzZVNyYyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6IFwifiNcIixcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlKGJhc2VTcmMsIFwiLi9lbnVtc1wiKSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNDA5NixcclxuICAgICAgb3V0RGlyOiBPVVRQVVRfRElSLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgdnVlOiBbXCJ2dWVcIiwgXCJ2dWUtcm91dGVyXCIsIFwicGluaWFcIiwgXCJ2dWUtaTE4blwiLCBcIkB2dWV1c2UvY29yZVwiXSxcclxuICAgICAgICAgICAgYW50ZDogW1wiYW50LWRlc2lnbi12dWVcIiwgXCJAYW50LWRlc2lnbi9pY29ucy12dWVcIiwgXCJkYXlqc1wiXSxcclxuICAgICAgICAgICAgLy8gbG9kYXNoOiBbJ2xvYWRzaC1lcyddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiAxODAsXHJcbiAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgLi4ucHJveHlPYmosXHJcbiAgICAgICAgW2Vudi5WSVRFX0FQUF9CQVNFX0FQSV06IHtcclxuICAgICAgICAgIHRhcmdldDogYGh0dHA6Ly8xMC45My45MC4zNzo4MGAsXHJcbiAgICAgICAgICAvLyB0YXJnZXQ6IGVudi5WSVRFX0FQUF9CQVNFX1VSTCxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxyXG4gICAgICAgICAgICBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7ZW52LlZJVEVfQVBQX0JBU0VfQVBJfWApLCBcIlwiKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHRlc3Q6IHtcclxuICAgICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxYWktKXFxcXHh6LWNsb3VkLXBsYXRmb3JtXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFhaS0pcXFxceHotY2xvdWQtcGxhdGZvcm1cXFxccGx1Z2luc1xcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovWFpLSi94ei1jbG91ZC1wbGF0Zm9ybS9wbHVnaW5zL2luZGV4LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgR2VuZXJhdGVDb25maWcgZnJvbSAndW5wbHVnaW4tY29uZmlnL3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCBWaXRlUGx1Z2luUHJlbG9hZEFsbCBmcm9tICdAbWlzdGpzL3ZpdGUtcGx1Z2luLXByZWxvYWQnXHJcbmltcG9ydCBVbm9jc3MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcbmltcG9ydCBBbnRkdlJlc29sdmVyIGZyb20gJ2FudGR2LWNvbXBvbmVudC1yZXNvbHZlcidcclxuaW1wb3J0IHsgR0xPQl9DT05GSUdfRklMRV9OQU1FLCBPVVRQVVRfRElSIH0gZnJvbSAnLi9jb25zdGFudHMnXHJcbmltcG9ydCB7IHZpdGVCdWlsZEluZm8gfSBmcm9tICcuL3ZpdGUtYnVpbGQtaW5mbydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlUGx1Z2lucyhlbnY6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcclxuICBjb25zdCB2aXRlUGx1Z2luTGlzdDogKFBsdWdpbk9wdGlvbiB8IFBsdWdpbk9wdGlvbltdKVtdID0gW1xyXG4gICAgdnVlKCksXHJcbiAgICB2dWVKc3goKSxcclxuICAgIFZpdGVQbHVnaW5QcmVsb2FkQWxsKCksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICd2dWUnLFxyXG4gICAgICAgICd2dWUtcm91dGVyJyxcclxuICAgICAgICAndnVlLWkxOG4nLFxyXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxyXG4gICAgICAgICdwaW5pYScsXHJcbiAgICAgIF0sXHJcbiAgICAgIGR0czogJ3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJyxcclxuICAgICAgZGlyczogWydzcmMvc3RvcmVzJywgJ3NyYy9jb21wb3NhYmxlcyddLFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbQW50ZHZSZXNvbHZlcigpXSxcclxuICAgICAgZHRzOiAndHlwZXMvY29tcG9uZW50cy5kLnRzJyxcclxuICAgICAgZGlyczogWydzcmMvY29tcG9uZW50cyddLFxyXG4gICAgfSksXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20va2lya2xpbi91bnBsdWdpbi1jb25maWdcclxuICAgIEdlbmVyYXRlQ29uZmlnKHtcclxuICAgICAgYXBwTmFtZTogZW52LlZJVEVfR0xPQl9BUFBfVElUTEUsXHJcbiAgICAgIGNvbmZpZ0ZpbGU6IHtcclxuICAgICAgICBnZW5lcmF0ZTogdHJ1ZSxcclxuICAgICAgICBmaWxlTmFtZTogR0xPQl9DT05GSUdfRklMRV9OQU1FLFxyXG4gICAgICAgIG91dHB1dERpcjogT1VUUFVUX0RJUixcclxuICAgICAgfSxcclxuICAgICAgZW52VmFyaWFibGVzOiB7XHJcbiAgICAgICAgcHJlZml4OiAnVklURV9HTE9CXycsXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIFVub2NzcygpLFxyXG4gICAgdml0ZUJ1aWxkSW5mbyhlbnYuVklURV9BUFBfTkFNRSksXHJcbiAgXVxyXG4gIHJldHVybiB2aXRlUGx1Z2luTGlzdFxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcWFpLSlxcXFx4ei1jbG91ZC1wbGF0Zm9ybVxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxYWktKXFxcXHh6LWNsb3VkLXBsYXRmb3JtXFxcXHBsdWdpbnNcXFxcY29uc3RhbnRzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9YWktKL3h6LWNsb3VkLXBsYXRmb3JtL3BsdWdpbnMvY29uc3RhbnRzLnRzXCI7Ly8gVGhpcyBjb25zdGFudCBkZWZpbmVzIHRoZSBuYW1lIG9mIHRoZSBjb25maWd1cmF0aW9uIGZpbGUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gdGhlIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRcclxuZXhwb3J0IGNvbnN0IEdMT0JfQ09ORklHX0ZJTEVfTkFNRSA9ICdwbGF0Zm9ybS9fYXBwLmNvbmZpZy5qcydcclxuXHJcbi8vIFRoaXMgY29uc3RhbnQgc2V0cyB0aGUgb3V0cHV0IGRpcmVjdG9yeSBmb3IgdGhlIFZpdGUgcGFja2FnZVxyXG5leHBvcnQgY29uc3QgT1VUUFVUX0RJUiA9ICdwbGF0Zm9ybSdcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxYWktKXFxcXHh6LWNsb3VkLXBsYXRmb3JtXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFhaS0pcXFxceHotY2xvdWQtcGxhdGZvcm1cXFxccGx1Z2luc1xcXFx2aXRlLWJ1aWxkLWluZm8udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1haS0oveHotY2xvdWQtcGxhdGZvcm0vcGx1Z2lucy92aXRlLWJ1aWxkLWluZm8udHNcIjtpbXBvcnQgeyByZWFkZGlyLCBzdGF0IH0gZnJvbSAnbm9kZTpmcydcclxuaW1wb3J0IHR5cGUgeyBQbHVnaW4sIFJlc29sdmVkQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xyXG5pbXBvcnQgdHlwZSB7IERheWpzIH0gZnJvbSAnZGF5anMnXHJcbmltcG9ydCBkdXJhdGlvbiBmcm9tICdkYXlqcy9wbHVnaW4vZHVyYXRpb24nXHJcbmltcG9ydCBwa2cgZnJvbSAncGljb2NvbG9ycydcclxuXHJcbmNvbnN0IHsgZ3JlZW4sIGJsdWUsIGJvbGQgfSA9IHBrZ1xyXG5kYXlqcy5leHRlbmQoZHVyYXRpb24pXHJcblxyXG5jb25zdCBmaWxlTGlzdFRvdGFsOiBudW1iZXJbXSA9IFtdXHJcblxyXG5mdW5jdGlvbiByZWN1cnNpdmVEaXJlY3RvcnkoZm9sZGVyOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xyXG4gIHJlYWRkaXIoZm9sZGVyLCAoZXJyLCBmaWxlczogc3RyaW5nW10pID0+IHtcclxuICAgIGlmIChlcnIpXHJcbiAgICAgIHRocm93IGVyclxyXG4gICAgbGV0IGNvdW50ID0gMFxyXG4gICAgY29uc3QgY2hlY2tFbmQgPSAoKSA9PiB7XHJcbiAgICAgICsrY291bnQgPT09IGZpbGVzLmxlbmd0aCAmJiBjYWxsYmFjaygpXHJcbiAgICB9XHJcbiAgICBmaWxlcy5mb3JFYWNoKChpdGVtOiBzdHJpbmcpID0+IHtcclxuICAgICAgc3RhdChgJHtmb2xkZXJ9LyR7aXRlbX1gLCBhc3luYyAoZXJyLCBzdGF0cykgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgICB0aHJvdyBlcnJcclxuICAgICAgICBpZiAoc3RhdHMuaXNGaWxlKCkpIHtcclxuICAgICAgICAgIGZpbGVMaXN0VG90YWwucHVzaChzdGF0cy5zaXplKVxyXG4gICAgICAgICAgY2hlY2tFbmQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XHJcbiAgICAgICAgICByZWN1cnNpdmVEaXJlY3RvcnkoYCR7Zm9sZGVyfS8ke2l0ZW19L2AsIGNoZWNrRW5kKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgICBmaWxlcy5sZW5ndGggPT09IDAgJiYgY2FsbGJhY2soKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN1bShhcnI6IG51bWJlcltdKSB7XHJcbiAgcmV0dXJuIGFyci5yZWR1Y2UoKHQ6IG51bWJlciwgYzogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gdCArIGNcclxuICB9LCAwKVxyXG59XHJcbmZ1bmN0aW9uIGZvcm1hdEJ5dGVzKGE6IG51bWJlciwgYj86IG51bWJlcik6IHN0cmluZyB7XHJcbiAgaWYgKGEgPT09IDApXHJcbiAgICByZXR1cm4gJzAgQnl0ZXMnXHJcbiAgY29uc3QgYyA9IDEwMjRcclxuICBjb25zdCBkID0gYiB8fCAyXHJcbiAgY29uc3QgZSA9IFsnQnl0ZXMnLCAnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXVxyXG4gIGNvbnN0IGYgPSBNYXRoLmZsb29yKE1hdGgubG9nKGEpIC8gTWF0aC5sb2coYykpXHJcbiAgcmV0dXJuIGAke051bWJlci5wYXJzZUZsb2F0KChhIC8gYyAqKiBmKS50b0ZpeGVkKGQpKX0gJHtlW2ZdfWBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZpdGVCdWlsZEluZm8obmFtZTogc3RyaW5nKTogUGx1Z2luIHtcclxuICBsZXQgY29uZmlnOiBSZXNvbHZlZENvbmZpZ1xyXG4gIGxldCBzdGFydFRpbWU6IERheWpzXHJcbiAgbGV0IGVuZFRpbWU6IERheWpzXHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6ICd2aXRlOmJ1aWxkSW5mbycsXHJcbiAgICBjb25maWdSZXNvbHZlZChyZXNvbHZlZENvbmZpZykge1xyXG4gICAgICBjb25maWcgPSByZXNvbHZlZENvbmZpZ1xyXG4gICAgfSxcclxuICAgIGJ1aWxkU3RhcnQoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgIGJvbGQoXHJcbiAgICAgICAgICBncmVlbihcclxuICAgICAgICAgICAgYFx1RDgzRFx1REM0Rlx1NkIyMlx1OEZDRVx1NEY3Rlx1NzUyOCR7Ymx1ZShgWyR7bmFtZX1dYCl9XHVGRjBDXHU3M0IwXHU1NzI4XHU2QjYzXHU1MTY4XHU1MjlCXHU0RTNBXHU2MEE4JHtjb25maWcuY29tbWFuZCA9PT0gJ2J1aWxkJyA/ICdcdTYyNTNcdTUzMDUnIDogJ1x1N0YxNlx1OEJEMSdcclxuICAgICAgICAgICAgfWAsXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICksXHJcbiAgICAgIClcclxuICAgICAgaWYgKGNvbmZpZy5jb21tYW5kID09PSAnYnVpbGQnKVxyXG4gICAgICAgIHN0YXJ0VGltZSA9IGRheWpzKG5ldyBEYXRlKCkpXHJcbiAgICB9LFxyXG4gICAgY2xvc2VCdW5kbGUoKSB7XHJcbiAgICAgIGlmIChjb25maWcuY29tbWFuZCA9PT0gJ2J1aWxkJykge1xyXG4gICAgICAgIGVuZFRpbWUgPSBkYXlqcyhuZXcgRGF0ZSgpKVxyXG4gICAgICAgIHJlY3Vyc2l2ZURpcmVjdG9yeShjb25maWcuYnVpbGQub3V0RGlyLCAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgYm9sZChcclxuICAgICAgICAgICAgICBncmVlbihcclxuICAgICAgICAgICAgICAgIGBcdTYwNkRcdTU1OUNcdTYyNTNcdTUzMDVcdTVCOENcdTYyMTBcdUQ4M0NcdURGODlcdUZGMDhcdTYwM0JcdTc1MjhcdTY1RjYke2RheWpzXHJcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbihlbmRUaW1lLmRpZmYoc3RhcnRUaW1lKSlcclxuICAgICAgICAgICAgICAgICAgLmZvcm1hdCgnbW1cdTUyMDZzc1x1NzlEMicpfVx1RkYwQ1x1NjI1M1x1NTMwNVx1NTQwRVx1NzY4NFx1NTkyN1x1NUMwRlx1NEUzQSR7Zm9ybWF0Qnl0ZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgc3VtKGZpbGVMaXN0VG90YWwpLFxyXG4gICAgICAgICAgICAgICAgICApfVx1RkYwOWAsXHJcbiAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgIClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxlQUFlO0FBQ3hCLFNBQVMscUJBQXFCO0FBQzlCLFlBQVksYUFBYTtBQUN6QixTQUFTLGVBQWU7OztBQ0h4QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sZ0JBQWdC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
