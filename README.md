# Claude Code を Windows 上で DevContainer で動かす方法

この記事では、DevContainer を利用して Windows 環境でも Claude Code を簡単かつ確実に動作させる手順を説明します。

## 前提条件

- `Rancher Desktop` がインストールされていること
  `Visual Studio Code` および `Dev Containers 拡張機能` がインストールされていること

## セットアップ手順

1. **このリポジトリをクローン**
   `bash
git clone <このリポジトリのURL>
cd devcontainer-claude
    `

2. **VS Code でフォルダを開く**

   - VS Code で`devcontainer-claude`フォルダを開きます。
   - `Dev Containers`かコンテナを開始する

- ![alt text](./images/image01.png)

  - `devcontainer.json`を選択して`Run Claude Code`を開始する

-![alt text](./images/image02.png)

![alt text](./images/image03.png))

3. **Claude Code の利用**
   - コンテナ内で Claude Code が利用可能になります。

## 補足

- 特定の言語向けの開発環境にする方法
- https://containers.dev/features から必要な環境を選んで、`devcontainer.json` の `features` に追加しましょう。

## 参考

-[Windows 上の DevContainer で簡単に Claude Code 動かす方法](https://zenn.dev/taichi/articles/a4ea249f7d0f6b)
