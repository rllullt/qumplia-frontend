
import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';

export type ActorId = string;

export interface Config {
  gas_to_delete_session: number | string | bigint;
  minimum_session_duration_ms: number | string | bigint;
  ms_per_block: number | string | bigint;
}

export type Status = 'Pending' | 'Approved' | 'Rejected';

export interface CampaignEvaluation {
  campaign_id: number | string | bigint;
  user_hash: string;
  timestamp: number | string | bigint;
  status: Status;
  metadata: string;
}

export interface IoCampaignState {
  all_evaluations: CampaignEvaluation[];
  last_evaluator: Array<[number | string | bigint, string]>;
}

export interface IoEvaluation {
  campaign_id: number | string | bigint;
  user_hash: string;
  timestamp: number | string | bigint;
  status: Status;
  metadata: string;
}

export interface SignatureData {
  key: ActorId;
  duration: number | string | bigint;
  allowed_actions: ActionsForSession[];
}

export type ActionsForSession = 'SubmitEvaluation' | 'ChangeStatus' | 'UpdateMetadata';

export interface SessionData {
  key: ActorId;
  expires: number | string | bigint;
  allowed_actions: ActionsForSession[];
  expires_at_block: number;
}

const types = {
  Config: {
    gas_to_delete_session: 'u64',
    minimum_session_duration_ms: 'u64',
    ms_per_block: 'u64',
  },
  Status: { _enum: ['Pending', 'Approved', 'Rejected'] },
  CampaignEvaluation: {
    campaign_id: 'u64',
    user_hash: 'String',
    timestamp: 'u64',
    status: 'Status',
    metadata: 'String',
  },
  IoCampaignState: {
    all_evaluations: 'Vec<CampaignEvaluation>',
    last_evaluator: 'Vec<(u64, String)>',
  },
  IoEvaluation: {
    campaign_id: 'u64',
    user_hash: 'String',
    timestamp: 'u64',
    status: 'Status',
    metadata: 'String',
  },
  SignatureData: { key: '[u8;32]', duration: 'u64', allowed_actions: 'Vec<ActionsForSession>' },
  ActionsForSession: { _enum: ['SubmitEvaluation', 'ChangeStatus', 'UpdateMetadata'] },
  SessionData: {
    key: '[u8;32]',
    expires: 'u64',
    allowed_actions: 'Vec<ActionsForSession>',
    expires_at_block: 'u32',
  },
  EvaluationSubmitted: {
    0: 'u64',
    1: 'String',
    2: 'Status',
  },
  EvaluationStatusChanged: {
    0: 'u64',
    1: 'Status',
  },
  EvaluationMetadataUpdated: {
    0: 'u64',
    1: 'String',
  },
};

export type EvaluationSubmittedEvent = [number | string | bigint, string, Status];
export type EvaluationStatusChangedEvent = [number | string | bigint, Status];
export type EvaluationMetadataUpdatedEvent = [number | string | bigint, string];

export class Program {
  public readonly registry: TypeRegistry;
  public readonly service: Service;
  public readonly session: Session;

  constructor(
    public api: GearApi,
    private _programId?: `0x${string}`,
  ) {
    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.service = new Service(this);
    this.session = new Session(this);
  }

  public get programId(): `0x${string}` {
    if (!this._programId) throw new Error('Program ID is not set');
    return this._programId;
  }

  newCtorFromCode(code: Uint8Array | Buffer, config: Config): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      ['New', config],
      '(String, Config)',
      'String',
      code,
    );
    this._programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`, config: Config): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      ['New', config],
      '(String, Config)',
      'String',
      codeId,
    );
    this._programId = builder.programId;
    return builder;
  }
}

export class Service {
  constructor(private _program: Program) {}

  public changeStatus(
    campaign_id: number | string | bigint,
    new_status: Status,
    session_for_account: ActorId | null,
  ): TransactionBuilder<string> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<string>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Service', 'ChangeStatus', campaign_id, new_status, session_for_account],
      '(String, String, u64, Status, Option<[u8;32]>)',
      'String',
      this._program.programId,
    );
  }

  public submitEvaluation(
    campaign_id: number | string | bigint,
    user_hash: string,
    status: Status,
    metadata: string,
    session_for_account: ActorId | null,
  ): TransactionBuilder<string> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<string>(
      this._program.api,
      this._program.registry,
      'send_message',
      [
        'Service',
        'SubmitEvaluation',
        campaign_id,
        user_hash,
        status,
        metadata,
        session_for_account,
      ],
      '(String, String, u64, String, Status, String, Option<[u8;32]>)',
      'String',
      this._program.programId,
    );
  }

  public updateMetadata(
    campaign_id: number | string | bigint,
    new_metadata: string,
    session_for_account: ActorId | null,
  ): TransactionBuilder<string> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<string>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Service', 'UpdateMetadata', campaign_id, new_metadata, session_for_account],
      '(String, String, u64, String, Option<[u8;32]>)',
      'String',
      this._program.programId,
    );
  }

  public async queryAllEvaluations(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<IoCampaignState> {
    const payload = this._program.registry.createType('(String, String)', ['Service', 'QueryAllEvaluations']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, IoCampaignState)', reply.payload);
    return result[2].toJSON() as unknown as IoCampaignState;
  }

  public async queryEvaluation(
    campaign_id: number | string | bigint,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<IoEvaluation | null> {
    const payload = this._program.registry.createType('(String, String, u64)', ['Service', 'QueryEvaluation', campaign_id]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<IoEvaluation>)', reply.payload);
    return result[2].toJSON() as IoEvaluation | null;
  }

  public async queryLastEvaluator(
    campaign_id: number | string | bigint,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<string | null> {
    const payload = this._program.registry.createType('(String, String, u64)', ['Service', 'QueryLastEvaluator', campaign_id]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<String>)', reply.payload);
    return result[2].toJSON() as string | null;
  }

  public subscribeToEvaluationSubmittedEvent(callback: (data: EvaluationSubmittedEvent) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) return;
      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Service' && getFnNamePrefix(payload) === 'EvaluationSubmitted') {
        void Promise.resolve(callback(
          this._program.registry.createType('(String, String, EvaluationSubmitted)', message.payload)[2].toJSON() as EvaluationSubmittedEvent
        )).catch(console.error);
      }
    });
  }

  public subscribeToEvaluationStatusChangedEvent(callback: (data: EvaluationStatusChangedEvent) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) return;
      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Service' && getFnNamePrefix(payload) === 'EvaluationStatusChanged') {
        void Promise.resolve(callback(
          this._program.registry.createType('(String, String, EvaluationStatusChanged)', message.payload)[2].toJSON() as EvaluationStatusChangedEvent
        )).catch(console.error);
      }
    });
  }

  public subscribeToEvaluationMetadataUpdatedEvent(callback: (data: EvaluationMetadataUpdatedEvent) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) return;
      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Service' && getFnNamePrefix(payload) === 'EvaluationMetadataUpdated') {
        void Promise.resolve(callback(
          this._program.registry.createType('(String, String, EvaluationMetadataUpdated)', message.payload)[2].toJSON() as EvaluationMetadataUpdatedEvent
        )).catch(console.error);
      }
    });
  }
}

export class Session {
  constructor(private _program: Program) {}

  public createSession(signature_data: SignatureData, signature: `0x${string}` | null): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Session', 'CreateSession', signature_data, signature],
      '(String, String, SignatureData, Option<Vec<u8>>)',
      'Null',
      this._program.programId,
    );
  }

  public deleteSessionFromAccount(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Session', 'DeleteSessionFromAccount'],
      '(String, String)',
      'Null',
      this._program.programId,
    );
  }

  public deleteSessionFromProgram(session_for_account: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Session', 'DeleteSessionFromProgram', session_for_account],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public async sessionForTheAccount(
    account: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<SessionData | null> {
    const payload = this._program.registry.createType('(String, String, [u8;32])', ['Session', 'SessionForTheAccount', account]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<SessionData>)', reply.payload);
    return result[2].toJSON() as SessionData | null;
  }

  public async sessions(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<[ActorId, SessionData]>> {
    const payload = this._program.registry.createType('(String, String)', ['Session', 'Sessions']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Vec<([u8;32], SessionData)>)', reply.payload);
    return result[2].toJSON() as Array<[ActorId, SessionData]>;
  }

  public subscribeToSessionCreatedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) return;
      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Session' && getFnNamePrefix(payload) === 'SessionCreated') {
        void Promise.resolve(callback(null)).catch(console.error);
      }
    });
  }

  public subscribeToSessionDeletedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) return;
      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Session' && getFnNamePrefix(payload) === 'SessionDeleted') {
        void Promise.resolve(callback(null)).catch(console.error);
      }
    });
  }
}
