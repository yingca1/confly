# Confly

[![NPM version](https://img.shields.io/npm/v/confly?color=a1b858&label=)](https://www.npmjs.com/package/confly)

[English](./README.md) | [中文](./README-zh_CN.md)

## How to use

### Confly Folder Structure

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

1. **Basic Rule**: `[base config] + [overlay config] => snapshot`
2. Config files currently support `json` and `js`.

### Confly CLI Tool

Using confly cli, you can manage many sets of configurations for the same project in a unified way. Place the common configurations in the `base` folder and place the different configurations in subfolders under `overlays`. By running `confly synth`, all the configuration files can be easily synthesized into snapshots, preserving the original configuration files and the synthesized results for easy rollback.

Managing configuration files is not an easy task, but with Confly, you can write raw files in formats such as js, yaml, and toml while preserving comments to make management easier. You can even write your own js code to customize configuration generation strategies.

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

The project recognizes `confly.<profile>.yml` as the configuration file, with `confly.yml` as the default configuration.

To set the `profile`:

1. Set the `profile` via environment variable `CONFLY_PROFILE`
2. Specify the `profile` in `confly.yml`


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
