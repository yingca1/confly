# Confly

[![NPM version](https://img.shields.io/npm/v/confly?color=a1b858&label=)](https://www.npmjs.com/package/confly)

[English](./README.md) | [中文](./README-zh_CN.md)

## 使用说明

### Confly 文件组织约定

```bash
|- config
    |- base
        |- config1.json
        |- config2.json
    |- overlays
        |- dev
            |- config3.js
            |- config4.json
        |- prod
            |- config5.js
            |- config6.json
        |- staging
            |- config7.js
            |- config8.js
    |- snapshots
        |- base.json
        |- dev.json
        |- prod.json
        |- staging.json
```

1. **基本规则**: `[base config] + [overlay config] => snapshot`
2. 配置文件目前支持: `json`, `js`

### Confly CLI 工具

使用 confly cli 可以将同一个项目很多套配置统一管理，将不同配置公用的配置放置在 `base` 文件夹中，将不同配置的文件放置在 `overlays` 下面的子文件中，通过 `confly synth` 可以轻易的将所有的配置文件合成到 snapshots 中，保留原始配置文件和合成后的结果，方便随时回溯过程。

管理配置文件是一件非常不容易的事情，在 confly 中编写原始文件，计划允许使用 `js`, `yaml`, `toml` 等格式保留注释，方便管理。甚至可以自己编写 `js` 代码定制配置生成策略。

```bash
# 1. npm install globally
npm install confly -g

confly -h

# 2. run with npx
npx confly -h
```

```bash
# Compile the organized files in the specified working directory into the "snapshots" folder according to the specified rules.
confly synth <confly-config-folder>

# Display the results of the current snapshots, which can be displayed according to the profile.
confly print <confly-config-folder> | jq '.'
```

- [jq tutorial](https://stedolan.github.io/jq/tutorial/)

### Use in Node.js project

```bash
npm install confly --save
```

```javascript
const confly = require("confly");

async main() {
  await confly.init();
}

main();
```

#### confly.yml

项目约定识别 `confly.<profile>.yml` 作为配置文件，`confly.yml` 为默认配置

设置 `profile` 的方式:

1. 环境变量 `CONFLY_PROFILE` 设置 `profile`
2. 在 `confly.yml` 中指定 `profile`

```yml
workspace:
  path: .confly
stores:
  - type: http
    priority: 0
    watch: true
    source: https://raw.githubusercontent.com/yingca1/confly/main/config-examples/config1/snapshots/dev.json
    token: <github-token>
    interval: 30
  - type: file
    enable: false
    priority: 0
    watch: true
    source: ./config.json
  - type: argv
    priority: 999
  - type: env
    priority: 998
profiles:
  active: default
```

## License

[MIT](./LICENSE) License © 2023
