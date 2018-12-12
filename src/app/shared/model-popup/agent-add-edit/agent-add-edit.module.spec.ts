import { AgentAddEditModule } from './agent-add-edit.module';

describe('AgentAddEditModule', () => {
  let agentAddEditModule: AgentAddEditModule;

  beforeEach(() => {
    agentAddEditModule = new AgentAddEditModule();
  });

  it('should create an instance', () => {
    expect(agentAddEditModule).toBeTruthy();
  });
});
