import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-agent-add-edit',
  templateUrl: './agent-add-edit.component.html',
  styleUrls: ['./agent-add-edit.component.css']
})
export class AgentAddEditComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AgentAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) { }

  ngOnInit() {
  }

}
