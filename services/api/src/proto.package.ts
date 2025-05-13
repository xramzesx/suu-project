import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from './proto/analyze';

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'proto', 'analyze.proto'),
  {},
);

const proto = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as ProtoGrpcType;

const gymuPackage = proto.gymu;

export default gymuPackage;
