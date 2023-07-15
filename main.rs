#![allow(macro_expanded_macro_exports_accessed_by_absolute_paths)]

#[macro_use] extern crate rocket;
extern crate maud;

use maud::{Markup, html, DOCTYPE};
use rocket::fs::FileServer;

macro_rules! relative {
	($path: expr) => (concat!(env!("CARGO_MANIFEST_DIR"), $path))
}

#[get("/")]
fn index() -> Markup {
	html! {
		(DOCTYPE)

		html {
			head {
				title { "WebXR Test" }

				style {
					r#"
						html {
							background-color: black;
						}

						button {
							font-size: 50px;
						}
					"#r
				}
			}

			body {
				button id="enter-vr" { "VR not supported" }
				script src="/public/index.js" {}
			}
		}
	}
} 

#[launch]
fn rocket() -> _ {
	let rocket = rocket::build();

	rocket
		.mount("/", routes![index])
		.mount("/public", FileServer::from(relative!("/public")))
}
