import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    modalService = TestBed.inject(NgbModal);
    spyOn(modalService, 'open');

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    let resultPromise: Promise<any>;
    
    beforeEach(() => {
      resultPromise = Promise.resolve('woo!');
      const result = resultPromise;
      modalService.open.and.returnValue({ result });
    });

    describe('set', () => {
      it('should call open with content and options', async () => {
        component.open = true;

        await resultPromise;

        expect(modalService.open).toHaveBeenCalledWith(
          component.modalContent,
          jasmine.objectContaining({
            backdrop: 'static',
            size: 'xl'
          })
        );
      });

      it('should cause openChange to emit event', async () => {
        const emittedPromise = firstValueFrom(
          component.openChange as any
        ).then(() => true);
        component.open = true;

        const emitted = await emittedPromise;
        
        expect(emitted).toEqual(true);
      });
    });
  });
});
