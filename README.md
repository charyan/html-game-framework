# html-game-framework: Build a story based html game
![html-game-framework screenshot](https://github.com/charyan/rc/raw/master/hgf.png)

## Build instructions
First you will need to [install Rust](https://www.rust-lang.org/tools/install)
```bash
git clone https://github.com/charyan/html-game-framework.git
cd html-game-framework/
cd hgf-maker/
cargo build --release
```

## How to use the html-game-framework
### Create your game with the hgf-designer
Open `hgf-designer/index.hmtl` in a web browser. Create your game. The first scene in the list will be the start of your game. Once you're done, click on `Export to JSON`.

### Build the game
Create the game based on your game.json file created above.
```bash
hgf-maker/target/release/hgf-maker SOURCE DEST # SOURCE being your game.json file and DEST the destination directory you want your game files in
```
Copy you images in `DEST/img`.
Copy the CSS stylesheet from `game/style.css` to `DEST`.

### Launching the game
Open `DEST/index.html` in a web browser.