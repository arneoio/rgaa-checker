import MessageSender from "../../00-base/utils/message-sender";


export default class Devtools {
  criteriaCardList: Array<any>;

  constructor() {
    this.init();
  }

  init() {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  runTests(criteriaCardList: Array<any>) {
    this.criteriaCardList = criteriaCardList;

    MessageSender.sendMessage('runTests');
  }

  handleMessage(request: any, sender: any, sendResponse: any) {
    switch (request.action) {
      case 'testsCompleted':
        console.log('Tests completed from content', request.results);
        this.parseResults(request.results);

        const criteriaUpdatedEvent = new Event('rgaachecker-initialized', {
          bubbles: true, // L'événement peut se propager à travers la hiérarchie DOM
          cancelable: true, // L'événement peut être annulé
        });
        document.body.dispatchEvent(criteriaUpdatedEvent);
        break;
    }
  }

  parseResults(criteriaList: any) {
    console.log('Parsing results', criteriaList);
    // results data structure
    // 4.2: {
    //   topicNumber: 4,
    //   criteriaNumber: 2,
    //   highlightSwitchLabel:"Highlight",
    //   messageList:{NT: 'Toutes les images de la page ont une alternative t…ici toutes les images sans alternative textuelle.', NC: "Toutes les images de la page n'ont pas d'alternati…ici toutes les images sans alternative textuelle.", NA: "Aucune image n'a été trouvée dans la page./!\\ En l…ici toutes les images sans alternative textuelle."},
    //   status:"NT",
    //   testList:{1: 'NT', 2: 'NA', 3: 'NA', 4: 'NA', 5: 'NA', 6: 'NA', 7: 'NA', 8: 'NA'}
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
