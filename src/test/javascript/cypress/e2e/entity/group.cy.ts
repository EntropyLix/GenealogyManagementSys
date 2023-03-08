import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Group e2e test', () => {
  const groupPageUrl = '/group';
  const groupPageUrlPattern = new RegExp('/group(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const groupSample = {};

  let group;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/groups+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/groups').as('postEntityRequest');
    cy.intercept('DELETE', '/api/groups/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (group) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/groups/${group.id}`,
      }).then(() => {
        group = undefined;
      });
    }
  });

  it('Groups menu should load Groups page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('group');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Group').should('exist');
    cy.url().should('match', groupPageUrlPattern);
  });

  describe('Group page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(groupPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Group page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/group/new$'));
        cy.getEntityCreateUpdateHeading('Group');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', groupPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/groups',
          body: groupSample,
        }).then(({ body }) => {
          group = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/groups+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/groups?page=0&size=20>; rel="last",<http://localhost/api/groups?page=0&size=20>; rel="first"',
              },
              body: [group],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(groupPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Group page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('group');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', groupPageUrlPattern);
      });

      it('edit button click should load edit Group page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Group');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', groupPageUrlPattern);
      });

      it('edit button click should load edit Group page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Group');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', groupPageUrlPattern);
      });

      it('last delete button click should delete instance of Group', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('group').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', groupPageUrlPattern);

        group = undefined;
      });
    });
  });

  describe('new Group page', () => {
    beforeEach(() => {
      cy.visit(`${groupPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Group');
    });

    it('should create an instance of Group', () => {
      cy.get(`[data-cy="name"]`).type('bus').should('have.value', 'bus');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        group = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', groupPageUrlPattern);
    });
  });
});
