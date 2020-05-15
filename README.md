# ome-speedrun-layout
NodeCG layout bundle for RTA 1n Kagawa Online.

## Requirements

- `nodecg ^1.1.1`
- `node.js` v12 or later is recommended.
- [cma2819/nodecg-speedcontrol](https://github.com/cma2819/nodecg-speedcontrol)

## Installation

NodeCGの`bundles`フォルダ内でコマンドを実行してください。

```
$ git clone https://github.com/cma2819/ome-speedrun-layout.git
```

or

```
$ nodecg install cma2819/ome-speedrun-layout
```

その後、必要なライブラリを下記コマンドでインストールします。

```
$ npm install
```

また、このバンドルの実行には`nodecg-speedcontrol`バンドルが必要です。正常な動作のためには、フォークされた[cma2819/nodecg-speedcontrol](https://github.com/cma2819/nodecg-speedcontrol)をインストールする必要があります。

```
$ git clone https://github.com/cma2819/nodecg-speedcontrol.git
$ npm install --production
```

or

```
$ nodecg install cma2819/nodecg-speedcontrol
```

## Build

`graphics` 用のWebフォントを`src/browser/graphics/_lib/font.js`で読み込む必要があります。

デフォルトのフォントでビルドするためには空の`src/browser/graphics/_lib/font.js`を作成してください。

その後、下記のコマンドで`dashboard` `graphics` `extension` の各ファイルが作成されます。

```
$ npm run build
```

## Run

NodeCGを起動することで実行できます。

## Credit

- くろいろ: ロゴ作成 / Logo design
- [ken](https://twitter.com/ken7253_): graphicsデザイン / Graphics design
