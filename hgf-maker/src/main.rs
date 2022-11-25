use serde::{Deserialize, Serialize};

use ammonia::clean_text;

use core::panic;
use std::fs;
use std::fs::File;
use std::io::Write;
use std::env;

#[derive(Serialize, Deserialize)]
struct Action{
    uid: String,
    text: String
}

#[derive(Serialize, Deserialize)]
struct Scene {
    uid: String,
    title: String,
    img: String,
    text: String,
    actions: Vec<Action>
}

fn html_format(s: &Scene, title: String, first_uid:String) -> String{
    let mut data : String = "".to_string();

    data += &(format!("<!DOCTYPE html>\n"));
    data += &(format!("<html lang=\"en\">\n"));
    data += &(format!("<head>\n"));
    data += &(format!("    <meta charset=\"UTF-8\">\n"));
    data += &(format!("    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n"));
    data += &(format!("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"));
    data += &(format!("    <title>{}</title>\n", clean_text(&title)));
    data += &(format!("    <link rel=\"stylesheet\" href=\"style.css\"></head>\n"));
    data += &(format!("<body>\n"));
    if s.title != "" {data += &(format!("    <h1>{}</h1>\n", clean_text(&s.title)));}
    if s.img != "" {data += &(format!("    <img src=\"img/{}\" alt=\"{}\"> \n", clean_text(&s.img), clean_text(&s.title)));}
    if s.text != "" {
        data += &(format!("    <p>\n"));
        data += &(format!("{}\n", clean_text(&s.text)));
        data += &(format!("    </p>\n"));
    }
    
    if s.actions.len() > 0 {
        data += &(format!("    <div id=\"buttons\">\n"));
    
        for action in &s.actions {
            if first_uid == action.uid {
                data += &(format!("    <a class=\"actionButton\" href=\"index.html\">{}</a>\n", clean_text(&action.text)));
            } else {
                data += &(format!("    <a class=\"actionButton\" href=\"{}.html\">{}</a>\n", clean_text(&action.uid), clean_text(&action.text)));
            }
        }
        
        data += &(format!("    </div>\n"));
    }
    data += &(format!("</body>\n"));
    data += &(format!("</html>\n"));
    

    return data;

}

fn write_html(dst: String, s: &Scene, title: String, first_uid:String) -> std::io::Result<()>{
    let mut file = File::create(dst)?;
    file.write_all(html_format(s, title, first_uid).as_bytes())?;

    Ok(())
}

fn help() {
    println!("Usage: hgf-maker SOURCE DEST");
    println!("Build game from SOURCE JSON file to DEST directory");
    print!("\n");
    println!("Info: Put images in DEST/img directory\n");
}

fn main() {
    let args: Vec<_> = env::args().collect();
    if args.len() < 3 {
        help();
        std::process::exit(-1);
    }

    let data = fs::read_to_string(args[1].to_string()).expect("Can't read file");

    let v : Vec<Scene> = serde_json::from_str(&data).expect("JSON Parsing failed. Check file structure");

    let mut first_scene_title:String = "".to_string();
    let mut first_scene_uid:String = "".to_string();

    //  Check if each uid is unique
    let mut uids : Vec<String> = Vec::new();
    for scene in &v{
        if let Some(str) = uids.iter().find(|&s| *s == scene.uid){
            panic!("UID not unique: {}", str);
        } else {
            uids.push(scene.uid.clone());
        }
    }

    let dst: &mut String = &mut args[2].to_string();
    if args[args.len()-1] != "/" {
        dst.push('/');
    }

    // Build HTML
    let mut count = 0;
    for scene in &v {
        if count == 0 {
            first_scene_title = scene.title.to_string();
            first_scene_uid = scene.uid.to_string();
            write_html(dst.clone()+"index.html",&scene, first_scene_title.clone(), first_scene_uid.clone()).unwrap();
        } else {    
            write_html(dst.clone()+&scene.uid.to_string()+".html",&scene, first_scene_title.clone(), first_scene_uid.clone()).unwrap();
        }
        count += 1;
    }
}