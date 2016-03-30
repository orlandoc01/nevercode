class FolderModalCtrl {
  constructor(Folders) {
    this.Folders = Folders;
  }

  renameFolder() {
    this.Folders.renameFolder(this.selectedfolder, this.name);
    this.hideModal();
  }

  hideModal() {
    this.show = false;
  }
}

class SnippetsCtrl {
  constructor($ngRedux, Snippets, Folders, Public, $state) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.Public = Public;
    this.Folders = Folders;
    this.Snippets = Snippets;
    this.folderInput = false;
    this.folderModalShow = false;
    this.folderModal = {};
    this.$state = $state;
  }

  toggleFolderModal(folderObj) {
    this.folderModal = folderObj;
    this.folderModalShow = !this.folderModalShow;
  }

  hideModal() {
    this.show = false;
  }

  addFolder() {
    let path = this.selectedFolder + '/' + this.subFolder.name;
    if (!this.snippetMap[path]) {
      this.Folders.addFolder({ path: path });
      this.subFolder.name = '';
    } else {
      Materialize.toast('Can not use duplicate name', 3000, 'rounded');
    }
  }
  removeFolder(folderPath) {
    this.Folders.removeFolder(folderPath);
  }
  changeActiveTab(folderPath) {
    this.Folders.selectFolder(folderPath);
  }
  toggleFolderNameInput() {
    this.folderInput = !this.folderInput;
  }
  copySnippet(snippet) {
    this.Snippets.getSnippet({ snippetId: snippet._id });
  }
  toggleFavorite(snippet) {
    let _id = snippet.value ? snippet.value._id : snippet._id;
    let favorite = snippet.value ? !snippet.value.favorite : !snippet.favorite;
    this.Snippets.updateSnippet({ _id, favorite }, snippet.filePath);
  }
  changeSelectedSnippet(snippetPath) {
    if (this.selectedPublicSnippet) {
      if(this.selectedPublicSnippet !== snippetPath) {
        this.Public.setSelectedPublicSnippet(snippetPath);
      }
    } else {
      if(this.selectedSnippet !== snippetPath) {
        this.Snippets.changeSelectedSnippet(snippetPath);
      }
    }
  }
  deselectSnippet() {
    this.Public.removeSelectedPublicSnippet();
    this.Snippets.deselectSnippet();
  }
  removeSnippet(snippetObj) {
    this.Snippets.removeSnippet(snippetObj);
  }
  closeSideNav() {
    this.$state.go('main.editor');
  }
  showToolbar(id) {
    $('#'+id).toggle(400);
    $('.tooltipped').tooltip({delay: 50});
  }
  mapStateToThis(state) {
    let { selectedFolder, snippetMap, selectedSnippet, selectedPublicSnippet, publicList } = state;
    let visibleFolders = [],
      visibleSnippets = [];
    let selectedFolderObj = snippetMap[selectedFolder];
    if (selectedPublicSnippet) {
      visibleSnippets = publicList;
    } else if (selectedFolderObj) {
      selectedFolderObj.children.forEach(childKey => {
        let child = snippetMap[childKey];
        if (typeof child.value === 'string') {
          visibleFolders.push(child);
        } else if (child.value.name !== '.config') {
          visibleSnippets.push(child);
        }
      });
    }
    let favoritesArr = [];
    Object.keys(snippetMap).forEach(key => {
      let snippetVal = snippetMap[key].value;
      if (typeof snippetVal === 'object') {
        if (snippetVal.name !== '.config' && snippetVal.name !== '/.config') {
          favoritesArr.push(snippetVal);
        }
      }
    });
    return {
      selectedPublicSnippet,
      visibleSnippets,
      visibleFolders,
      selectedFolderObj,
      selectedFolder,
      selectedSnippet,
      snippetMap,
      favoritesArr
    };
  }
}

export const snippets = (url) => {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require(`.${url}.html`),
    access: { restricted: true }
  };
};

export let createFolderModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      selectedfolder: '=',
      name: '=',
      email: '='
    },
    link(scope, element, attrs) {
      scope.dialogStyle = {};
      if(attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if(attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }
    },
    controllerAs: 'folderModalCtrl',
    controller: FolderModalCtrl,
    bindToController: true,
    template: require(`./folderModal.html`)
  };
};

