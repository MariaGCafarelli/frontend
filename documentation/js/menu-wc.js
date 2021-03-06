'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">front-wave documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-b67f72ff24cd7078006b84b2eec7b297"' : 'data-target="#xs-components-links-module-AppModule-b67f72ff24cd7078006b84b2eec7b297"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-b67f72ff24cd7078006b84b2eec7b297"' :
                                            'id="xs-components-links-module-AppModule-b67f72ff24cd7078006b84b2eec7b297"' }>
                                            <li class="link">
                                                <a href="components/AdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminCrudComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminCrudComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CambiarContrasenaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CambiarContrasenaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CategoriaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CategoriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CategoriasAdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CategoriasAdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CategoriasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CategoriasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ComentariosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ComentariosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContenidoRecomendadoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContenidoRecomendadoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForosAdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForosAdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IniciarSesionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IniciarSesionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InicioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InicioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LostPasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LostPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PagoPremiumComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PagoPremiumComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PictureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PictureComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PictureForoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PictureForoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrarAdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistrarAdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrarUsuarioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistrarUsuarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubAdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubAdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubCategoriaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubCategoriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsuarioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsuarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsuariosAdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsuariosAdminComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-b67f72ff24cd7078006b84b2eec7b297"' : 'data-target="#xs-pipes-links-module-AppModule-b67f72ff24cd7078006b84b2eec7b297"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-b67f72ff24cd7078006b84b2eec7b297"' :
                                            'id="xs-pipes-links-module-AppModule-b67f72ff24cd7078006b84b2eec7b297"' }>
                                            <li class="link">
                                                <a href="pipes/DateAgoPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateAgoPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ForoFilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForoFilterPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyErrorStateMatcher.html" data-type="entity-link">MyErrorStateMatcher</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyErrorStateMatcher-1.html" data-type="entity-link">MyErrorStateMatcher</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostDto.html" data-type="entity-link">PostDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/Postservice.html" data-type="entity-link">Postservice</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WaveServiceService.html" data-type="entity-link">WaveServiceService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link">AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminGuard.html" data-type="entity-link">AdminGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Category.html" data-type="entity-link">Category</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContentCategory.html" data-type="entity-link">ContentCategory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Foro.html" data-type="entity-link">Foro</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RespI.html" data-type="entity-link">RespI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubCategory.html" data-type="entity-link">SubCategory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});