# html-game-framework: Build a story based html game
## Screenshots
### Games made with html-game-framework
[Game made by a human](https://charyan.github.io/html-game-framework/demo/)  
  
[Beach: game made by ChatGPT and Dalle (game.json generated with ChatGPT and images with Dall-e)](https://charyan.github.io/html-game-framework/demo_chatgpt_dalle/)  
  
[Cyberpunk city: game made by ChatGPT and Dalle (game.json generated with ChatGPT and images with Dall-e)](https://charyan.github.io/html-game-framework/demo_chatgpt_dalle_2/)  
  
![html-game-framework screenshot](https://github.com/charyan/html-game-framework/raw/master/hgf-ex.png)
### Creation of a game with the hgf-designer
[Try it live](https://charyan.github.io/html-game-framework/hgf-designer/)
![html-game-framework screenshot](https://github.com/charyan/html-game-framework/raw/master/hgf.png)

## Build instructions
First you will need to [install Rust](https://www.rust-lang.org/tools/install)
```bash
git clone https://github.com/charyan/html-game-framework.git
cd html-game-framework/hgf-maker/
cargo build --release
cd ..
```

## How to use the html-game-framework
### Create your game with the hgf-designer
Open `html-game-framework/hgf-designer/index.hmtl` in a web browser. Create your game. The first scene in the list will be the start of your game. Once you're done, click on `Export to JSON`.

### Build the game
Create the game based on your game.json file created above.
```bash
# SOURCE being your game.json file and DEST the destination directory you want your game files in
html-game-framework/hgf-maker/target/release/hgf-maker SOURCE DEST
```
Copy you images in `DEST/img`.
Copy the CSS stylesheet from `html-game-framework/game/style.css` to `DEST`.

### Launching the game
Open `DEST/index.html` in a web browser.
