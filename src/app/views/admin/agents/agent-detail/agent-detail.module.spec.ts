import { AgentDetailModule } from './agent-detail.module';

describe('AgentDetailModule', () => {
  let agentDetailModule: AgentDetailModule;

  beforeEach(() => {
    agentDetailModule = new AgentDetailModule();
  });

  it('should create an instance', () => {
    expect(agentDetailModule).toBeTruthy();
  });
});
