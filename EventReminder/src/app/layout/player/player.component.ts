import {
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Player } from '@vime/angular';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PlayerComponent implements OnChanges {
  @Input() id!: string;
  @Input() path!: string;

  @ViewChild('player') player!: Player;

  viewRef!: EmbeddedViewRef<Player>;

  constructor(
    private viewContainer: ViewContainerRef
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['path']) {
    //   if (this.viewRef) {
    //     this.destroyView();
    //   }

    //   this.createView();
    // }
  }

  ngOnInit(): void {}

  public start() {
    this.player.play();
  }

  public stop() {
    this.player.pause()
  }

}
