import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TextEditorService } from '../text-editor.service';
import { IState } from '../textEditorTypes';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

interface ITextState {
  null: boolean;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  bulletedList: boolean;
}

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements AfterViewInit, OnInit {
  private replaceBreakContainerWithNewElement: boolean = false;
  @ViewChild('TextArea') public TextAreaElement: ElementRef;
  private TextArea: ElementRef;
  private previousState: ITextState;
  @Input() formGroupName!: string;
  form!: FormGroup;

  public content = new FormControl({ value: '', disabled: true });

  private states: ITextState = {
    null: true,
    bold: false,
    italic: false,
    underline: false,
    bulletedList: false,
  };

  constructor(
    private textEditorService: TextEditorService,
    private rootFormGroup: FormGroupDirective,
  ) {}

  handleSelection() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startNode = range.startContainer.parentNode;
    const endNode = range.endContainer.parentNode;
    const startOffSet = range.startOffset;
    const endOffSet = range.endOffset;
    const mainContainer = range.commonAncestorContainer as HTMLElement;

    if (selection.toString().length === 0) {
      return;
    }

    if (mainContainer.id === 'TextArea') {
      this.travelThroughNodes(
        startNode as HTMLElement,
        startNode,
        endNode,
        endOffSet,
        startOffSet,
        range,
      );
      selection.removeAllRanges();
    } else {
      this.travelThroughNode(
        startNode,
        startNode,
        endNode,
        endOffSet,
        startOffSet,
        range,
      );
    }
  }

  private travelThroughNode(
    node: Node,
    startContainer: Node,
    endContainer: Node,
    endOffSet: number,
    startOffset: number,
    range: Range,
  ) {
    let textContainer: string = '';
    const nodeContainer = this.nodeText();

    if (endContainer === startContainer) {
      if (startOffset === 0 && endOffSet === endContainer.textContent.length) {
        textContainer = node.textContent;
        const htmlTree = this.createTreeFromState(textContainer)[0];
        nodeContainer.appendChild(htmlTree);
        const paragraph = this.findParagraphNode(node as HTMLElement);
        const spanTextNode = this.findSpanNode(node as HTMLElement);
        paragraph.replaceChild(nodeContainer, spanTextNode);
        return;
      }

      if (startOffset !== 0 && endOffSet !== endContainer.textContent.length) {
        const prevNode = node.cloneNode(true);
        const nextNode: HTMLElement = this.findSpanNode(
          node as HTMLElement,
        ).cloneNode(true) as HTMLElement;
        const nullNode = this.findNode('null', nextNode);
        nullNode.textContent = node.textContent.slice(
          endOffSet,
          node.textContent.length,
        );
        textContainer = node.textContent.slice(startOffset, endOffSet);
        const htmlTree = this.createTreeFromState(textContainer)[0];
        nodeContainer.appendChild(htmlTree);
        node.textContent = node.textContent.slice(0, startOffset);
        const elementNode = this.findSpanNode(node as HTMLElement);
        elementNode.insertAdjacentElement('afterend', nodeContainer);
        nodeContainer.insertAdjacentElement('afterend', nextNode);
        return;
      }
      if (startOffset !== 0 && endOffSet === endContainer.textContent.length) {
        const nextNode: HTMLElement = this.findSpanNode(
          node as HTMLElement,
        ).cloneNode(true) as HTMLElement;
        const nullNode = this.findNode('null', nextNode);
        textContainer = node.textContent.slice(startOffset, endOffSet);
        const htmlTree = this.createTreeFromState(textContainer)[0];
        nodeContainer.appendChild(htmlTree);
        node.textContent = node.textContent.slice(0, startOffset);
        this.findSpanNode(node as HTMLElement).insertAdjacentElement(
          'afterend',
          nodeContainer,
        );
        return;
      }
    } else {
      const paragraph = this.findParagraphNode(node as HTMLElement);
      let nodeToAdjecenting;
      let childToRemove;
      if (node === startContainer) {
        textContainer += node.textContent.slice(
          startOffset,
          node.textContent.length,
        );
        if (startOffset !== 0) {
          node.textContent = node.textContent.slice(0, startOffset);
          nodeToAdjecenting = this.findSpanNode(node as HTMLElement);
        } else {
          if (!this.findSpanNode(node as HTMLElement).previousSibling) {
            nodeToAdjecenting = null;
          } else {
            nodeToAdjecenting = this.findSpanNode(
              node as HTMLElement,
            ).previousSibling;
          }
        }

        node = this.findSpanNode(node as HTMLElement);
        if (!nodeToAdjecenting) {
          childToRemove = node;
        }
        node = node.nextSibling;
        node = this.findNode('null', node as HTMLElement);
        if (childToRemove) {
          paragraph.removeChild(childToRemove);
        }
      }
      console.log(nodeToAdjecenting);

      let applyingState = true;

      while (applyingState) {
        console.log(node);
        if (node === endContainer) {
          applyingState = false;
          textContainer += node.textContent.slice(0, endOffSet);
          if (endOffSet !== endContainer.textContent.length) {
            node.textContent = node.textContent.slice(
              endOffSet,
              node.textContent.length,
            );
          } else {
            node = this.findSpanNode(node as HTMLElement);
            paragraph.removeChild(node);
          }
          const htmlTree = this.createTreeFromState(textContainer)[0];
          nodeContainer.appendChild(htmlTree);
          if (nodeToAdjecenting) {
            nodeToAdjecenting.insertAdjacentElement('afterend', nodeContainer);
          } else {
            paragraph.appendChild(nodeContainer);
          }
          break;
        }

        textContainer += node.textContent;
        node = this.findSpanNode(node as HTMLElement);
        const childToRemove = node;
        node = node.nextSibling;
        console.log(node);
        console.log(childToRemove);
        node = this.findNode('null', node as HTMLElement);
        paragraph.removeChild(childToRemove);
      }
    }
  }

  private travelThroughNodes(
    node: HTMLElement,
    startContainer: Node,
    endContainer: Node,
    endOffSet: number,
    startOffset: number,
    range: Range,
  ) {
    const paragraph = this.findParagraphNode(node as HTMLElement);
    node = this.findNode('null', node as HTMLElement);
    let textContainer: string = '';
    let isStartNode = false;
    let isEndNode = false;

    if (!node) {
      return;
    }

    if (paragraph.className === 'elementNull' && node !== endContainer) {
      return this.travelThroughNodes(
        paragraph.nextSibling as HTMLElement,
        startContainer,
        endContainer,
        endOffSet,
        startOffset,
        range,
      );
    }

    console.log(range, startContainer, endContainer);

    if (node === startContainer) {
      if (startOffset !== 0) {
        isStartNode = true;
        textContainer += node.textContent?.slice(
          startOffset,
          node.textContent.length,
        );
        node.innerText = node.textContent.slice(0, startOffset);
      }
    }

    if (node === endContainer) {
      if (endOffSet !== node.textContent.length) {
        isEndNode = true;
        textContainer += node.textContent?.slice(0, endOffSet);
        node.innerText = node.textContent.slice(
          endOffSet,
          node.textContent.length,
        );
      }
    }

    this.applyStateToSelectedText(
      node,
      paragraph,
      textContainer,
      isStartNode,
      isEndNode,
    );

    if (isEndNode) {
      return;
    }
    console.log(paragraph.nextSibling);
    return this.travelThroughNodes(
      paragraph.nextSibling.firstChild as HTMLElement,
      startContainer,
      endContainer,
      endOffSet,
      startOffset,
      range,
    );
  }

  private applyStateToSelectedText(
    node: HTMLElement,
    paragraphNode: HTMLElement,
    textContainer: string,
    isStartNode: boolean,
    isEndNode: boolean,
  ) {
    let nodeText: ChildNode = this.findSpanNode(node) as ChildNode;
    let startNode = null;
    let endNode = null;
    if (isStartNode) {
      startNode = nodeText;
      nodeText = nodeText.nextSibling;
      isStartNode = false;
    }

    if (isEndNode) {
      endNode = nodeText;
    }

    while (nodeText) {
      if (!endNode) {
        const nextText = this.findNode('null', nodeText as HTMLElement);
        textContainer += nextText.textContent;
        const childToRemove = nodeText;
        nodeText = nodeText.nextSibling;
        paragraphNode.removeChild(childToRemove);
      } else {
        break;
      }
    }

    const treeNode = this.createTreeFromState(textContainer)[0];
    const nodeTextContainer = this.nodeText();
    nodeTextContainer.appendChild(treeNode);

    if (startNode) {
      startNode.insertAdjacentElement('afterend', nodeTextContainer);
    } else if (endNode) {
      endNode.insertAdjacentElement('beforebegin', nodeTextContainer);
    } else {
      paragraphNode.appendChild(nodeTextContainer);
    }
  }

  public onKeyChange(event: KeyboardEvent) {
    const focusedNode = this.findFocusNode();
    let container = this.findParagraphNode(
      focusedNode.parentNode as HTMLElement,
    );
    let leafText: HTMLElement;
    let baseNode: HTMLElement | null;
    const range = this.createRange();

    if (container) {
      if (container.className === 'elementNull') {
        this.replaceBreakContainerWithNewElement = true;
      }
    }

    console.log(focusedNode, container);

    if (event.key === 'Enter') {
      this.handleEnter(focusedNode, range);
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.handleBackspace(container, focusedNode, event);
      return;
    }

    const isStateSame = this.isPrevStateSame(this.previousState, this.states);

    if (!isStateSame || this.replaceBreakContainerWithNewElement) {
      const nodeContainer = this.nodeText();
      const nodes = this.createTreeFromState(event.key);
      leafText = nodes[0];
      baseNode = nodes[1];

      nodeContainer.appendChild(leafText);

      if (container.className === 'elementNull') {
        this.swapElementWithinParagraph(container, nodeContainer);
      } else if (container.className === 'element') {
        this.insertNewNode(focusedNode, nodeContainer);
      }

      this.updateRange(baseNode);
    }

    this.previousState = JSON.parse(JSON.stringify(this.states));
    this.replaceBreakContainerWithNewElement = false;
  }

  private handleBold(leafText) {
    const boldElement = this.createAndInsertElement('strong', 'bold');
    if (!leafText) {
      leafText = boldElement;
      return leafText;
    } else {
      boldElement.appendChild(leafText);
      leafText = boldElement;
      return leafText;
    }
  }

  private handleNull(key: string) {
    const newElement = this.createAndInsertElement('span', 'null');
    newElement.innerHTML = key;
    return newElement;
  }

  private hanldeUnderlineText(leafText: HTMLElement) {
    const newElementUnderline = this.createAndInsertElement('u', 'underline');
    if (!leafText) {
      leafText = newElementUnderline;
      return leafText;
    }
    newElementUnderline.appendChild(leafText);
    leafText = newElementUnderline;
    return leafText;
  }

  private handleItalic(leafText: HTMLElement) {
    const italicElement = this.createAndInsertElement('em', 'italic');
    if (!leafText) {
      leafText = italicElement;
      return leafText;
    } else {
      italicElement.appendChild(leafText);
      leafText = italicElement;
      return leafText;
    }
  }

  private handleBulletedList(leafText: HTMLElement) {
    const BulletedListElement = this.createAndInsertElement(
      'li',
      'bulletedList',
    );
    const ulElement = this.createAndInsertElement('ul', 'ul');
    if (!leafText) {
      leafText = BulletedListElement;
      return leafText;
    } else {
      BulletedListElement.appendChild(leafText);
      ulElement.appendChild(BulletedListElement);
      leafText = ulElement;
      return leafText;
    }
  }

  private handleEnter(focusedNode: HTMLElement, range: Range) {
    const newParagraph = this.createContainerElement('elementNull');
    const breakElement = document.createElement('br');
    const nodeContainer = this.nodeText();
    const container = this.findParagraphNode(focusedNode);
    const length = focusedNode.textContent?.length;
    const endOffSet = range.endOffset;
    const spanNode = this.findSpanNode(focusedNode);
    let nullElement: HTMLElement;

    nullElement = this.handleNull('&zwnj;');
    nullElement.appendChild(breakElement);
    newParagraph.appendChild(nullElement);

    if (!container) {
      console.log('paragraph node not found');
      return;
    }
    console.log(focusedNode.textContent);

    if (!spanNode) {
      container.insertAdjacentElement('afterend', newParagraph);
    } else if (length === endOffSet && !spanNode.nextSibling) {
      container.insertAdjacentElement('afterend', newParagraph);
    } else if (endOffSet === 0 && !spanNode.previousSibling) {
      container.insertAdjacentElement('beforebegin', newParagraph);
      return;
    } else {
      newParagraph.classList.remove('elementNull');
      newParagraph.classList.add('element');
      nullElement = this.splitText(
        focusedNode,
        newParagraph,
        container,
        endOffSet,
      );
    }

    this.updateRange(nullElement);
  }

  private handleBackspace(paragraphNode, focusedNode, event: KeyboardEvent) {
    console.log(paragraphNode, focusedNode);
    let isNodeText: boolean = false;
    const children = paragraphNode.childNodes;
    const length = children.length;

    if (length === 1 && children[0].className === 'nodeText') {
      if (children[0].textContent.length > 1) {
        isNodeText = true;
      }
    }

    if (!isNodeText) {
      if (paragraphNode.className !== 'elementNull') {
        const nodeContainer = this.nodeText();
        const nullElement = this.handleNull('&zwnj;');
        const nodeText = this.nodeText();
        nodeText.appendChild(nullElement);
        paragraphNode.replaceChild(nodeText, paragraphNode.firstChild);
        paragraphNode.classList.remove('element');
        paragraphNode.classList.add('elementNull');
        const spanNode = this.findNode('null', paragraphNode);
        this.updateRange(spanNode);
      } else {
        const previousParagraph = paragraphNode.previousSibling as HTMLElement;
        if (previousParagraph) {
          this.TextAreaElement.nativeElement.removeChild(paragraphNode);
          console.log(previousParagraph.lastChild);
          this.updateRangeToLastElement(previousParagraph.lastChild);
        }
      }
      event.preventDefault();
    }
  }

  private swapElementWithinParagraph(
    container: HTMLElement,
    newElement: HTMLElement,
  ): void {
    console.log(container.firstElementChild);
    const childToReplace = container.firstElementChild;
    container.replaceChild(newElement, childToReplace);
    container.classList.remove('elementNull');
    container.classList.add('element');
  }

  createAndInsertElement(tagName: string, className: string): HTMLElement {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
  }

  private isPrevStateSame(prevState, currentState): boolean {
    if (!prevState) {
      return false;
    }

    for (const key in prevState) {
      if (prevState[key] !== currentState[key]) {
        return false;
      }
    }
    return true;
  }

  //Finds the focus node (element before cursor) in the editor
  private findFocusNode(): HTMLElement {
    const sel = window.getSelection();
    const range = sel?.getRangeAt(0);
    let element = range.endContainer.parentNode as HTMLElement;

    if (
      element.className === 'element' ||
      element.className === 'elementNull'
    ) {
      element = range.endContainer as HTMLElement;
    }

    if (element.className !== 'TextArea') {
      return element as HTMLElement;
    }

    console.log('isChildNodes none');
    return this.TextAreaElement.nativeElement as HTMLElement;
  }

  private handleReplaceOfBreakWithNewText(
    paragraphContainer,
    newElement: HTMLElement,
  ) {
    if (
      paragraphContainer.className === 'element' ||
      paragraphContainer.className === 'elementNull'
    ) {
      const childToReplace = paragraphContainer.firstElementChild;
      paragraphContainer.replaceChild(newElement, childToReplace);
    }
  }

  private createContainerElement(className: string): HTMLElement {
    const containerElement = document.createElement('p');
    containerElement.classList.add(className);
    return containerElement;
  }

  private nodeText(): HTMLElement {
    return this.createAndInsertElement('span', 'nodeText');
  }

  private insertNewNode(focusedNode: HTMLElement, nodeContainer: HTMLElement) {
    const range = window.getSelection().getRangeAt(0);
    const endOffSet = range.endOffset;
    const startOffSet = range.startOffset;
    const lengthText = focusedNode.textContent.length;
    const spanNode = this.findSpanNode(focusedNode.parentNode as HTMLElement);

    if (lengthText === endOffSet) {
      console.log(spanNode);
      spanNode.insertAdjacentElement('afterend', nodeContainer);
      return;
    }

    if (endOffSet === 0) {
      spanNode.insertAdjacentElement('beforebegin', nodeContainer);
      return;
    }

    if (lengthText > endOffSet) {
      this.splitTextWithinParagraph(
        focusedNode,
        spanNode,
        endOffSet,
        nodeContainer,
      );
    }
  }

  // Recursively finds the first HTMLElement node with the class name 'nodeText 0'
  //starting from the provided focusedNode that needs to be child of the parent we are looking for.
  private findSpanNode(focusedNode: HTMLElement): HTMLElement | null {
    const node = focusedNode as HTMLElement;

    if (!node) {
      return null;
    }

    if (node.className === 'nodeText') {
      return node;
    } else {
      return this.findSpanNode(node.parentNode as HTMLElement);
    }
  }

  private findParagraphNode(focusedNode: HTMLElement): HTMLElement | null {
    if (!focusedNode) {
      return null;
    }

    if (
      focusedNode.className === 'element' ||
      focusedNode.className === 'elementNull'
    ) {
      return focusedNode;
    } else {
      return this.findParagraphNode(focusedNode.parentNode as HTMLElement);
    }
  }

  private createRange(): Range {
    return window.getSelection().getRangeAt(0);
  }

  private updateRange(element: HTMLElement): void {
    const selection = window.getSelection();
    console.log(selection);
    const range = document.createRange();
    const container = this.findParagraphNode(element);
    selection.removeAllRanges();
    console.log(container);

    if (container.className === 'elementNull') {
      range.setStart(element, 0);
      range.setEnd(element, 0);
    } else if (element.classList.contains('splitted')) {
      range.setStart(element, 0);
      range.setStart(element, 0);
      element.classList.remove('splitted');
    } else {
      range.setStart(element, 0);
      range.setEnd(element, 1);
    }
    selection.addRange(range);
  }

  private splitText(
    node: HTMLElement,
    newParagraph: HTMLElement,
    currentParahraph: HTMLElement,
    endOffSet: number,
  ) {
    const spanNode = this.findSpanNode(node);
    const copiedTreeNode = spanNode.cloneNode(true) as HTMLElement;
    const splittedText = node.textContent.slice(
      endOffSet,
      node.textContent.length,
    );
    node.innerText = node.textContent.slice(0, endOffSet);
    const newBaseNode = this.findNode('null', copiedTreeNode);
    newBaseNode.innerText = splittedText;
    const childToNewParagraph: HTMLElement[] = [copiedTreeNode];
    const newSpanNode = childToNewParagraph[0];
    this.copySiblings(childToNewParagraph, spanNode.nextSibling as HTMLElement);
    this.removeChildren(childToNewParagraph.slice(1), currentParahraph);
    this.addNewChildren(newParagraph, childToNewParagraph);
    currentParahraph.insertAdjacentElement('afterend', newParagraph);
    newBaseNode.classList.add('splitted');
    return newBaseNode;
  }

  private copySiblings(
    children: HTMLElement[],
    spanNode: HTMLElement,
  ): HTMLElement[] {
    if (!spanNode) {
      return children;
    }

    children.push(spanNode);
    return this.copySiblings(children, spanNode.nextSibling as HTMLElement);
  }

  private removeChildren(children: HTMLElement[], parent: HTMLElement): void {
    const childNodes = parent.childNodes;
    const length = parent.childNodes.length;
    let count = 0;

    for (let i = 0; i < length; i++) {
      if (childNodes[i] === children[count]) {
        parent.removeChild(children[count]);
        count += 1;
      }
    }
  }

  private addNewChildren(parent: HTMLElement, children: HTMLElement[]): void {
    const length = children.length;
    for (let i = 0; i < length; i++) {
      parent.appendChild(children[i]);
    }
  }

  private findNode(
    className: string,
    spanNode: HTMLElement,
  ): HTMLElement | null {
    console.log(spanNode);
    if (!spanNode) {
      return null;
    }

    if (spanNode.className === className) {
      return spanNode;
    }

    return this.findNode(className, spanNode.firstElementChild as HTMLElement);
  }

  private splitTextWithinParagraph(
    focusedNode: HTMLElement,
    spanNode: HTMLElement,
    endOffSet: number,
    nodeContainer: HTMLElement,
  ) {
    const copiedTree = spanNode.cloneNode(true) as HTMLElement;
    const splittedText = focusedNode.textContent.slice(
      endOffSet,
      focusedNode.textContent.length,
    );
    focusedNode.innerText = focusedNode.textContent.slice(0, endOffSet);
    spanNode.insertAdjacentElement('afterend', nodeContainer);
    const newBaseNode = this.findNode('null', copiedTree);
    newBaseNode.innerText = splittedText;
    nodeContainer.insertAdjacentElement('afterend', copiedTree);
  }

  private createTreeFromState(key: string): HTMLElement[] {
    let leafText: HTMLElement;
    let baseNode: HTMLElement;
    if (this.states.null) {
      leafText = this.handleNull(key);
      baseNode = leafText;
    }

    if (this.states.bold) {
      leafText = this.handleBold(leafText);
    }

    if (this.states.italic) {
      leafText = this.handleItalic(leafText);
    }

    if (this.states.underline) {
      leafText = this.hanldeUnderlineText(leafText);
    }

    if (this.states.bulletedList) {
      leafText = this.handleBulletedList(leafText);
    }

    return [leafText, baseNode];
  }

  private updateRangeToLastElement(lastChild: ChildNode) {
    const selection = window.getSelection();
    const range = document.createRange();

    // when paragraph is empty, break element is always at the end of the node.
    const isBreak: Boolean = lastChild.lastChild.nodeName === 'BR';

    //Find Text Node
    const nullNode = this.findTextNode(lastChild);

    if (!nullNode) {
      throw new Error('No text node found');
    }

    if (isBreak) {
      this.handleRangeForBreakElement(range, nullNode, selection);
    } else {
      this.handleRangeForTextElement(range, nullNode, selection);
    }
  }

  private findTextNode(node: Node) {
    if (!node) {
      return null;
    }

    if (node && node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    if (
      (node as HTMLElement).className !== 'null' &&
      (node as HTMLElement).className !== 'nodeText'
    ) {
      return this.findTextNode(node.nextSibling);
    } else {
      return this.findTextNode(node.firstChild);
    }
  }

  private handleRangeForTextElement(
    range: Range,
    node: Node,
    selection: Selection,
  ): void {
    range.setStart(node, node.textContent.length);
    range.setEnd(node, node.textContent.length);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private handleRangeForBreakElement(
    range: Range,
    node: Node,
    selection: Selection,
  ): void {
    range.setStart(node, 0);
    range.setEnd(node, 0);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  ngOnInit() {
    this.textEditorService.notifyBoldTextChange.subscribe((value: IState) => {
      this.states.bold = value.values.includes('bold');
    });

    this.textEditorService.notifyUnderlineTextChange.subscribe(
      (value: IState) => {
        this.states.underline = value.values.includes('underline');
      },
    );

    this.textEditorService.notifyItalicTextChange.subscribe((value: IState) => {
      this.states.italic = value.values.includes('italic');
    });

    this.textEditorService.notifyButteledListTextChange.subscribe(
      (value: IState) => {
        this.states.bulletedList = value.values.includes('bulletedList');
      },
    );

    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    // this.form.get('post_content').valueChanges.subscribe((value) => {
    //   console.log(value);
    // });
  }

  private get observeKeyDownEventFroTextArea() {
    return fromEvent(this.TextAreaElement.nativeElement, 'keydown').pipe(
      map((event: KeyboardEvent) => event.key),
      debounceTime(5000),
      distinctUntilChanged(),
    );
  }

  private sendHTMLToForm() {}

  ngAfterViewInit() {
    this.TextArea = this.TextAreaElement.nativeElement;
    this.observeKeyDownEventFroTextArea.subscribe((value) => {
      this.sendHTMLToForm();
    });
  }
}
