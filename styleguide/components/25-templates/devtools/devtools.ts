import MessageSender from "../../00-base/utils/message-sender";


export default class Devtools {
  criteriaCardList: Array<any>;

  constructor(criteriaCardList: Array<any>) {
    this.init(criteriaCardList);
  }

  init(criteriaCardList: Array<any>) {
    this.criteriaCardList = criteriaCardList;
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  runTests() {
    MessageSender.sendMessage('runTests');
  }

  handleMessage(request: any, sender: any, sendResponse: any) {
    switch (request.action) {
      case 'pageLoaded':
        console.log('Page loaded, run tests');
        this.runTests();
        break;
      case 'panelShown':
        console.log('panel shown, run tests');
        this.runTests();
        break;
      case 'testsCompleted':
        this.parseResults(request.result);
        const criteriaUpdatedEvent = new Event('rgaachecker-initialized', {
          bubbles: true, // L'événement peut se propager à travers la hiérarchie DOM
          cancelable: true, // L'événement peut être annulé
        });
        document.body.dispatchEvent(criteriaUpdatedEvent);
        break;
      case 'elementsHightlighted':
        break;
    }
  }

  parseResults(criteriaList: any) {
    // results data structure
    // 4.2: {
    //   topicNumber: 4,
    //   criteriaNumber: 2,
    //   highlightSwitchLabel:"Highlight",
    //   messageList:{NT: 'Toutes les images de la page ont une alternative t…ici toutes les images sans alternative textuelle.', NC: "Toutes les images de la page n'ont pas d'alternati…ici toutes les images sans alternative textuelle.", NA: "Aucune image n'a été trouvée dans la page./!\\ En l…ici toutes les images sans alternative textuelle."},
    //   status:"NT",
    //   testList:{1: 'NT', 2: 'NA'}
    // }
    Object.keys(criteriaList).forEach((key: string) => {
      let criterionData = criteriaList[key];
      let criterion = this.criteriaCardList.find((criterion: any) => {
        return criterion.topicNumber === criterionData.topicNumber && criterion.criteriaNumber === criterionData.criteriaNumber;
      });
      if(!criterion) {
        console.error(`Criterion ${criterionData.topicNumber}.${criterionData.criteriaNumber} not found`);
        return;
      }
      criterion.loadData(criterionData);
    });
  }
}
