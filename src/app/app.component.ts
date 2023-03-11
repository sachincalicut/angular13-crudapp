import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogComponent } from './uilements/dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { ApiService } from './service/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'angular-crud';
  displayedColumns: string[] = ['productName', 'category', 'freshness', 'cost', 'comment', 'date', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService){

  }
 
  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog(): void {
    //this.dialog.open(DialogComponent, { disableClose: true });
    const dialogRef = this.dialog.open(DialogComponent, {
      width:'33%'
    }).afterClosed().subscribe(val=>{
        if(val === 'save'){
          this.getAllProducts();
        }
    })
  }
  getAllProducts(){
    this.api.getProduct()
    .subscribe({
      next:(res)=>{
        //console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error:()=>{
        alert("Error while fetching the records :(")
      }
    })
  }
  editProducts(row: any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row

    }).afterClosed().subscribe(val=>{
      if(val === 'Update'){
        this.getAllProducts();
      }
    })
  }
  deleteProduct(id:number){
      this.api.deleteProduct(id)
      .subscribe({
          next:(res)=>{
            alert("Your Product has been deleted Successfully");
            this.getAllProducts();
          },
          error:()=>{
            alert("Error while deleting the record");
          }
      })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
