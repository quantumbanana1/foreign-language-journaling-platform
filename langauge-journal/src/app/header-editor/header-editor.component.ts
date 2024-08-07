import {Component, OnInit} from '@angular/core';
import { TextEditorService } from '../text-editor.service';
import { IState } from '../textEditorTypes';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-header-editor',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './header-editor.component.html',
  styleUrl: './header-editor.component.scss',
})
export class HeaderEditorComponent implements OnInit {
  constructor(private textEditorServe: TextEditorService) {}

  boldChecked: boolean = false;
  italicChecked: boolean = false;
  underlineChecked: boolean = false;
  quoteChecked: boolean = false;
  listChecked: boolean = false;
  imageChecked: boolean = false;

  setBold() {
    this.textEditorServe.setBold();
  }

  setItalic() {
    this.textEditorServe.setItalic();
  }

  setUnderline() {
    this.textEditorServe.setUnderline();
  }

  setQuote() {
    // this.textEditorServe.setQuote();
  }

  setBulletedList() {
    this.textEditorServe.setBulletedList();
  }



  ngOnInit() {
    this.textEditorServe.notifyBoldTextChange.subscribe((data) => {
      this.boldChecked = data.values.includes('bold');
    });


    this.textEditorServe.notifyUnderlineTextChange.subscribe((data: IState) => {
      this.underlineChecked = data.values.includes('underline');
    });

    this.textEditorServe.notifyButteledListTextChange.subscribe(
      (data: IState) => {
        this.listChecked = data.values.includes('bulletedList');
      },
    );

    this.textEditorServe.notifyItalicTextChange.subscribe((data: IState) => {
      this.italicChecked = data.values.includes('italic');
    });

  }


}

