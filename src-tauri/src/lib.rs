// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use std::fs;
use std::path::Path;

#[derive(Serialize, Clone)]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub children: Option<Vec<FileInfo>>,
}

/// Read directory contents recursively (up to 3 levels deep)
fn read_dir_recursive(path: &Path, depth: u32) -> Result<Vec<FileInfo>, String> {
    let mut entries: Vec<FileInfo> = Vec::new();

    let dir = fs::read_dir(path).map_err(|e| format!("Failed to read directory: {}", e))?;

    for entry in dir {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let metadata = entry
            .metadata()
            .map_err(|e| format!("Failed to read metadata: {}", e))?;
        let name = entry.file_name().to_string_lossy().to_string();
        let file_path = entry.path().to_string_lossy().to_string();

        // Skip hidden files/directories
        if name.starts_with('.') {
            continue;
        }

        let is_dir = metadata.is_dir();
        let children = if is_dir && depth < 3 {
            read_dir_recursive(&entry.path(), depth + 1).ok()
        } else if is_dir {
            Some(Vec::new())
        } else {
            None
        };

        entries.push(FileInfo {
            name,
            path: file_path,
            is_dir,
            children,
        });
    }

    // Sort: directories first, then alphabetically
    entries.sort_by(|a, b| {
        if a.is_dir == b.is_dir {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        } else if a.is_dir {
            std::cmp::Ordering::Less
        } else {
            std::cmp::Ordering::Greater
        }
    });

    Ok(entries)
}

#[tauri::command]
fn read_dir(path: &str) -> Result<Vec<FileInfo>, String> {
    let p = Path::new(path);
    if !p.exists() {
        return Err(format!("Path does not exist: {}", path));
    }
    if !p.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }
    read_dir_recursive(p, 0)
}

#[tauri::command]
fn read_file(path: &str) -> Result<String, String> {
    let p = Path::new(path);
    if !p.exists() {
        return Err(format!("File does not exist: {}", path));
    }
    fs::read_to_string(p).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
fn save_file(path: &str, content: &str) -> Result<(), String> {
    let p = Path::new(path);
    // Ensure parent directory exists
    if let Some(parent) = p.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create parent directory: {}", e))?;
    }
    fs::write(p, content).map_err(|e| format!("Failed to save file: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_dir, read_file, save_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
