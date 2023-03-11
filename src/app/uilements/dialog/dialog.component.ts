import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{

    freshnessList = ["Normal", "Standard", "Assured"];
    productForm !: FormGroup;
    actionBtn : string = "Save"
    constructor(private formBuilder : FormBuilder, private api : ApiService, @Inject (MAT_DIALOG_DATA) public editData : any, private dialogRef : MatDialogRef<DialogComponent>) {
      dialogRef.disableClose = true;
    }

    ngOnInit(): void {
      this.productForm = this.formBuilder.group({
        productName : ['', Validators.required],
        category : ['', Validators.required],
        freshness : ['', Validators.required],
        cost : ['', Validators.required],
        comment : ['', Validators.required],
        date : ['', Validators.required]
      })
      // console.log(this.editData);
      if(this.editData){
          this.actionBtn = "Update Changes";
          this.productForm.controls['productName'].setValue(this.editData.productName);
          this.productForm.controls['category'].setValue(this.editData.category);
          this.productForm.controls['freshness'].setValue(this.editData.freshness);
          this.productForm.controls['cost'].setValue(this.editData.cost);
          this.productForm.controls['comment'].setValue(this.editData.comment);
          this.productForm.controls['date'].setValue(this.editData.date);
      }
    }
    addProduct(){
     // console.log(this.productForm.value);
      if (!this.editData){
        if(this.productForm.valid){
          this.api.postProduct(this.productForm.value)
          .subscribe({
              next:(res)=>{
                alert("Product Added Successfully")
                this.productForm.reset();
                this.dialogRef.close('Saved');
              },
              error:()=> {
                alert("Error while uploading the data")
              }
          })
       }
      }else{
        this.updateProduct()
      }
    
    }
    updateProduct(){
      this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next:(res)=>{
          alert("Your Product details has been updated");
          this.productForm.reset();
          this.dialogRef.close('Update');
        },
        error: ()=>{
          alert("Error while updating the records");
        }
      })
    }
}
