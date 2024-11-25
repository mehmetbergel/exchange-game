import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InitData1732475808484 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash('eva.123', 10);

      const result = await queryRunner.query(
        `INSERT INTO user (name, email, password, created_at) VALUES (?, ?, ?, NOW())`,
        [`User_${i}`, `user${i}@eva.com`, hashedPassword],
      );

      users.push(result.insertId);
    }

    const wallets = [];
    for (const userId of users) {
      const result = await queryRunner.query(
        `INSERT INTO wallet (user_id, name, created_at) VALUES (?, ?, NOW())`,
        [userId, `Wallet for User ${userId}`],
      );
      wallets.push(result.insertId);
    }

    const shares = [];
    for (let i = 1; i <= 5; i++) {
      const result = await queryRunner.query(
        `INSERT INTO share (name, symbol, created_at) VALUES (?, ?, NOW())`,
        [`Share${i}`, `S${i}`],
      );
      shares.push(result.insertId);
    }

    for (const shareId of shares) {
      await queryRunner.query(
        `INSERT INTO share_price (share_id, price, price_time, created_at) VALUES (?, ?, NOW(), NOW())`,
        [shareId, Math.random() * 100],
      );
    }

    for (const walletId of wallets) {
      for (const shareId of shares) {
        const randomQuantity = Math.floor(Math.random() * 50) + 1;
        await queryRunner.query(
          `INSERT INTO wallet_shares (wallet_id, share_id, total_quantity, created_at) VALUES (?, ?, ?, NOW())`,
          [walletId, shareId, randomQuantity],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM wallet_shares`);
    await queryRunner.query(`DELETE FROM share_price`);
    await queryRunner.query(`DELETE FROM share`);
    await queryRunner.query(`DELETE FROM wallet`);
    await queryRunner.query(`DELETE FROM user`);
  }
}
