import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";


@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post!: Post; // een opmerking
  isLoading = false;
  form!: FormGroup;
  imagePreview!: string;
  private mode = "create";
  private postId!: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {validators: [Validators.required] }),
      'image': new FormControl(null, {
        validators: [Validators.required],
      asyncValidators: [mimeType]
    })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        paramMap.get("postId");
        // this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: "null"
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content}
            );
        });
      } else {
        this.mode = "create";
        this.postId = "null";
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    // console.log(file);
    // console.log(this.form);

  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }
}

// import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { ActivatedRoute, ParamMap } from '@angular/router';
// import { PostsService } from '../posts.service';
// import { Post } from '../post.model';

// @Component({
//   selector: 'app-post-create',
//   templateUrl: './post-create.component.html',
//   styleUrls: ['./post-create.component.css']
// })
// export class PostCreateComponent implements OnInit {
//   enteredContent = '';
//   enteredTitle = '';
//   post!: Post;
//   private mode = 'create';
//   private postId!: string;


//   constructor(public postsService: PostsService, public route: ActivatedRoute) {}

//   ngOnInit() {
//     this.route.paramMap.subscribe((paramMap: ParamMap) => {
//       if (paramMap.has('postId')) {
//         this.mode = 'edit';
//         // this.postId = paramMap.get('postId');
//         paramMap.get('postId');
//         this.postsService.getPost(this.postId).subscribe(postData => {
//           this.post = {_id: postData._id, title: postData.title, content: postData.content };
//         });
//       } else {
//         this.mode = 'create';
//         this.postId = "null";
//       }
//     });
//   }

//   onSavePost(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }
//     if (this.mode === "create") {
//     //   this.postsService.addPost(form.value.title, form.value.content);
//     // } else {
//       this.postsService.addPost(form.value.title, form.value.content);
//     } else {
//       this.postsService.updatePost(
//         this.postId,
//         form.value.title,
//         form.value.content
//       );
//     }
//     form.resetForm();
// }
// }
